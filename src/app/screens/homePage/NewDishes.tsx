import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import { AspectRatio, Card, CardOverflow, Typography } from "@mui/joy";
import { DescriptionOutlined, VisibilityOutlined } from "@mui/icons-material";
import Divider from "../../components/divider";
import { createSelector } from "reselect";
import { retrieveNewDishes } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";

const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
  newDishes,
}));

export default function NewDishes() {
  const { newDishes } = useSelector(newDishesRetriever);
  console.log("newDishes:", newDishes);

  return (
    <div className="new-dishes">
      <Container>
        <Stack className="new-section">
          <Box className="title">Daily Menu</Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {newDishes.length ? (
                newDishes.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  const sizeVolume =
                    product.productCollection === ProductCollection.DRINK
                      ? product.productVolume + " L"
                      : product.productSize + " SIZE";
                  return (
                    <Card className="card" key={product._id} variant="outlined">
                      <div className="card-image">
                        <div className="product-size">{sizeVolume}</div>
                        <AspectRatio ratio={1}>
                          <img src={imagePath} alt={product.productName} />
                        </AspectRatio>
                      </div>

                     
                        <Stack className="info">
                            <Typography className="name">
                              {product.productName}
                            </Typography>
                           
                            <Typography className="price">
                              {product.productPrice}$
                            </Typography>
                          <Stack>
                            <Typography
                              className="views"
                              display={"flex"}
                              alignItems={"center"}
                            >
                              {product.productViews}
                              <VisibilityOutlined
                                sx={{ fontSize: "25px", marginLeft: "5px" }}
                              />
                            </Typography>
                          </Stack>
                        </Stack>
                      
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">New dishes are not available</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
