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

const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);
interface OrderProps {
  setValue: (value: number) => void;
}
export default function PausedOrders(props: OrderProps) {
  const { setValue } = props;
  const { pausedOrders } = useSelector(pausedOrdersRetriever);
  console.log("pausedOrders:", pausedOrders);
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

  const toProcessOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      // PAYMENT INTEGRATION

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };
      const confirm = window.confirm("Do you want to proceed with payment?");
      if (confirm) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue(1);
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err);
    }
  };
  return (
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
                    onClick={toProcessOrderHandler}
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
