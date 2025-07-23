import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import { Card, Typography } from "@mui/joy";
import { VisibilityOutlined } from "@mui/icons-material";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { Product, ProductProps } from "../../../lib/types/product";
import { useHistory } from "react-router-dom";
import { sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";

const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes })
);

export default function PopularDishes(props: ProductProps) {
  const { onAdd } = props;
  const history = useHistory();
  const { popularDishes } = useSelector(popularDishesRetriever);
  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="popular-dishes">
      <Container>
        <Stack className="popular-section">
          <Box className="title">Popular Dishes</Box>
          <Stack className="cards-frame">
            {popularDishes.length ? (
              popularDishes.map((product: Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;
                return (
                  <CssVarsProvider key={product._id} >
                    <Card className="card"onClick={()=>chooseProductHandler(product._id)}>
                      <div
                        className="card-image"
                        style={{ background: `url(${imagePath})` }}
                      ></div>
                      <Stack className="card-info">
                        <Stack
                          flexDirection={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Typography
                            level="h2"
                            fontSize={"lg"}
                            textColor={"#000"}
                            mb={1}
                          >
                            {product.productName}
                          </Typography>
                          <Typography
                            fontWeight={"md"}
                            textColor={"neutral.500"}
                            sx={{
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            {product.productViews}
                            <VisibilityOutlined
                              sx={{ fontSize: "25px", marginLeft: "5px" }}
                            />
                          </Typography>
                        </Stack>
                        <Typography textColor={"#000"} mb={1}>
                          {product?.productDesc}
                        </Typography>
                        <Stack
                          flexDirection={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Typography
                            level="h2"
                            fontSize={"lg"}
                            textColor={"red"}
                            mb={1}
                          >
                            {product.productPrice} $
                          </Typography>
                          <button
                            className="shop-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              sweetTopSmallSuccessAlert("Successfully added", 700);
                              onAdd({
                                name: product.productName,
                                _id: product._id,
                                quantity: 1,
                                price: product.productPrice,
                                image: product.productImages[0],
                              });
                            }}
                          >
                            <img src="/icons/shopping-cart.svg" alt="" />
                          </button>
                        </Stack>
                      </Stack>
                    </Card>
                  </CssVarsProvider>
                );
              })
            ) : (
              <Box className="no-data">Popular dishes are not available</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
