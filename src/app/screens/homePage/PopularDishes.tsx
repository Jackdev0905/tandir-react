import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import {
  Card,
  CardContent,
  CardCover,
  CardOverflow,
  Typography,
} from "@mui/joy";
import { DescriptionOutlined, VisibilityOutlined } from "@mui/icons-material";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";



const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes })
);

export default function PopularDishes() {
  const { popularDishes } = useSelector(popularDishesRetriever);
  
  return (
    <div className="popular-dishes">
      <Container>
        <Stack className="popular-section">
          <Box className="title">Popular Dishes</Box>
          <Stack className="cards-frame">
            {popularDishes.length ? (
              popularDishes.map((product:Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`
                return (
                  <CssVarsProvider key={product._id}>
                    <Card className="card">
                      <CardCover>
                        <img src={imagePath} alt={product.productName} />
                      </CardCover>
                      <CardCover className={"card-cover"} />
                      <CardContent sx={{ justifyContent: "flex-end" }}>
                        <Stack>
                          <Typography
                            level="h2"
                            fontSize={"lg"}
                            textColor={"#fff"}
                            mb={1}
                          >
                            {product.productName}
                          </Typography>
                          <Typography
                            fontWeight={"md"}
                            textColor={"neutral.300"}
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
                      </CardContent>
                      <CardOverflow
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          py: 1,
                          borderTop: "1px solid",
                          height: "60px",
                        }}
                      >
                        <Typography
                          startDecorator={<DescriptionOutlined />}
                          textColor={"neutral.300"}
                        >
                          {product.productDesc}
                        </Typography>
                      </CardOverflow>
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
