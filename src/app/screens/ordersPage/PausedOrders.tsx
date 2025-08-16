import { Box, Button, Stack } from "@mui/material";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { useSelector } from "react-redux";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobal } from "../../hooks/useGlobal";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../../services/OrderService";
import { CloudDownload } from "@mui/icons-material";
import { useState } from "react";

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);
interface OrderProps {
  setValue: (value: number) => void;
  setImage: (image: string) => void;
  image: string;
}
export default function PausedOrders(props: OrderProps) {
  const { setValue, image, setImage } = props;
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  const [copied, setCopied] = useState(false);
  const textToCopy = "112 345267 789";
  const { authMember, setOrderBuilder } = useGlobal();

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };
      const confirm = window.confirm("Do you want to delete this order?");
      if (confirm) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };

  const toProcessOrderHandler = async (order: Order) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      // PAYMENT INTEGRATION
      if (image === "/img/cheque.jpg") throw new Error(Messages.error6);
      if (authMember.memberAddress === "") {
        throw new Error(Messages.error7);
      }

      const orderId = order._id;

      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };

      const confirm = window.confirm("Do you want to proceed with payment?");
      if (confirm) {
        const newOrder = new OrderService();
        await newOrder.updateOrder(input);
        handleSend(order);
        setValue(1);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    const fileType = file?.type;
    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validImageTypes.includes(fileType))
      sweetErrorHandling(Messages.error5);
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const [file, setFile] = useState<File | any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      console.log(selected);
    }
  };
  const BOT_TOKEN = "1115526529:AAErzbN-KViofQP-VLMgfSmgTjR3crYEh6I";
  const CHAT_ID = "637234125";
  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

  const handleSend = async (order: Order) => {
    const formatOrderText = () => {
      let itemsText = "";

      for (const [itemName, item] of Object.entries(order.orderItems)) {
        const product = order.productData.find(
          (ele: any) => ele._id === item.productId
        );
        const productName = product?.productName || "Unknown Item";

        itemsText += `🍽 ${productName} - ${item.itemQuantity} pcs x ${
          item.itemPrice
        }$ = ${item.itemQuantity * item.itemPrice}$\n`;
      }

      return `🛒 New Order!
👤 Member: ${authMember?.memberNick}
📞 Phone: ${authMember?.memberPhone}
🏠 Address: ${authMember?.memberAddress}
💰 Total: ${order.orderTotal}
🚚 Delivery: ${order.orderDelivery}

${itemsText.trim()}`;
    };

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("photo", file);
    formData.append("caption", formatOrderText());
    try {
      const res = await fetch(TELEGRAM_API, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        setImage("/img/cheque.jpg");
      }
    } catch (error) {
      console.error(error);
      sweetErrorHandling(error);
    }
  };

  return (
    <>
      <div className="paused orders">
        <Stack flexDirection={"column"}>
          {pausedOrders?.map((order: Order) => {
            return (
              <Stack
                className="order-box"
                key={order?._id}
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                <Stack sx={{ maxHeight: "180px", overflow: "scroll" }}>
                  {order?.orderItems?.map((orderItem: OrderItem) => {
                    const product: Product = order.productData.filter(
                      (ele: Product) => orderItem.productId === ele._id
                    )[0];

                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                    return (
                      <Box className="order-info" key={orderItem._id}>
                        <Box>
                          <img
                            src={imagePath}
                            alt="lavash"
                            className="order-img"
                          />
                          <p className="title-dish">{product.productName}</p>
                        </Box>

                        <Box className="price-box">
                          <p>${orderItem.itemPrice}</p>
                          <img src="/icons/close.svg" />
                          <p>{orderItem.itemQuantity}</p>
                          <img src="/icons/pause.svg" />
                          <p className="" style={{ marginLeft: "15px" }}>
                            ${orderItem.itemPrice * orderItem.itemQuantity}
                          </p>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>

                <Stack className="payment-box">
                  <Stack flexDirection={"row"} className="payment-title">
                    <p>Product price</p>
                    <p>${order.orderTotal - order.orderDelivery}</p>
                    <img src="/icons/close.svg" />
                    <p>Delivery cost ${order.orderDelivery}</p>
                    <img src="/icons/pause.svg" />
                    <p>Total ${order.orderTotal}</p>
                  </Stack>
                  <Stack flexDirection={"row"} className="btn-box">
                    <Button
                      className="cancel-btn"
                      value={order._id}
                      onClick={deleteOrderHandler}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="payment-btn"
                      value={order._id}
                      onClick={() => toProcessOrderHandler(order)}
                    >
                      Payment
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        {!pausedOrders ||
          (pausedOrders?.length === 0 && (
            <Stack flexDirection={"row"} justifyContent={"center"}>
              <img
                src="icons/noimage-list.svg"
                style={{ height: "300px", width: "300px" }}
              />
            </Stack>
          ))}

        <Stack flexDirection={"column"} className="user-detail">
          <Stack
            className="profil"
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack
              className="user"
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box className="user-img">
                <img
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  alt="justin"
                />
              </Box>
              <Box className="user-name">{authMember?.memberNick}</Box>
              <Box sx={{ color: "rgb(161, 161, 161)", fontSize: "20px" }}>
                {authMember?.memberType}
              </Box>
            </Stack>
            <Box className="location">
              <img src="/icons/location.svg" alt="" />
              <p>
                {authMember?.memberAddress
                  ? authMember.memberAddress
                  : "No address"}
              </p>
            </Box>
          </Stack>

          <Stack className="payment">
            <Stack className="card-info">
              <div className="detail">
                {textToCopy}

                <Button onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="detail">Busan bank (Justin)</div>
            </Stack>

            <h3>Upload payment cheque</h3>

            <Box className={"payment-frame"}>
              <div className="payment-image">
                <img src={image} />
              </div>

              <div className={"payment-change-box"}>
                <div className={"update-box"}>
                  <Button component="label" onChange={handleImageViewer}>
                    <CloudDownload />
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                </div>
                <p>JPG</p>
                <p>JPEG</p>
                <p>PNG</p>

                <p>formats</p>
                <p> only!</p>
              </div>
            </Box>
          </Stack>
        </Stack>
      </div>
    </>
  );
}
