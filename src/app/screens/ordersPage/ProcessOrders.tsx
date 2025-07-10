import { Box, Button, Stack } from "@mui/material";
import moment from "moment";
import { createSelector } from "reselect";
import { retrieveProcessOrders } from "./selector";
import { useSelector } from "react-redux";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobal } from "../../hooks/useGlobal";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);
interface OrderProps {
  setValue: (value: number) => void;
}
export default function ProcessOrders(props: OrderProps) {
  const { processOrders } = useSelector(processOrdersRetriever);
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobal();

  // HANDLERS
  const toFinishedOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.FINISH,
      };
      const confirm = window.confirm("Have you recieved the order?");
      if (confirm) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue(2);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };
  return (
    <div className="process orders">
      <Stack flexDirection={"column"}>
        {processOrders?.map((order: Order) => {
          console.log("time", String(order.updatedAt).split("T"));

          const date = String(order.updatedAt).split("T")[0].slice(2)
          const time = String(order.updatedAt).split("T")[1].split(".")[0].slice(0,5)
          return (
            <Stack
              className="order-box"
              key={order._id}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Stack sx={{ maxHeight: "180px", overflow: "scroll" }}>
                {order?.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];

                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box className="order-info" key={item._id}>
                      <Box>
                        <img
                          src={imagePath}
                          alt="lavash"
                          className="order-img"
                        />
                        <p className="title-dish">{product.productName}</p>
                      </Box>

                      <Box className="price-box">
                        <p>${item.itemPrice}</p>
                        <img src="/icons/close.svg" />
                        <p>{item.itemQuantity}</p>
                        <img src="/icons/pause.svg" />
                        <p className="" style={{ marginLeft: "15px" }}>
                          ${item.itemPrice * item.itemQuantity}
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
                <Stack
                  flexDirection={"row"}
                  className="btn-box"
                  alignItems={"center"}
                >
                  <Box className="payment-time">
                    {date + " " + time}
                  </Box>
                  <Button
                    className="verify-btn"
                    value={order._id}
                    onClick={toFinishedOrderHandler}
                  >
                    Verify to fulfil
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      {!processOrders ||
        (processOrders?.length === 0 && (
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
            <input type="text" placeholder="Card Number" />
            <Box
              className="inputs"
              display={"flex"}
              justifyContent={"space-between"}
            >
              <input type="text" placeholder="07/24" width={"100px"} />
              <input type="text" placeholder="CVV: 010" />
            </Box>
            <input type="text" placeholder="Justin Robertson" />
          </Stack>
          <Stack className="cards">
            <img src="/icons/western-card.svg" alt="card" />
            <img src="/icons/master-card.svg" alt="card" />
            <img src="/icons/paypal-card.svg" alt="card" />
            <img src="/icons/visa-card.svg" alt="card" />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
