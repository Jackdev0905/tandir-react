import { Box, Stack } from "@mui/material";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobal } from "../../hooks/useGlobal";

const finishedFinishedRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);

export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedFinishedRetriever);
  const { authMember } = useGlobal();

  return (
    <div className="finished orders">
      <Stack flexDirection={"column"}>
        {finishedOrders?.map((order: Order) => {
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
              </Stack>
            </Stack>
          );
        })}
      </Stack>

      {!finishedOrders ||
        (finishedOrders?.length === 0 && (
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
