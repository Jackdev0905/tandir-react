import {
  Badge,
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import {
  Cake,
  DinnerDining,
  KebabDining,
  LocalBar,
  RemoveRedEye,
  RestaurantMenu,
  Search,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setProducts } from "./slice";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Product,
  ProductInquiry,
  ProductProps,
} from "../../../lib/types/product";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { ChangeEvent, useEffect, useState } from "react";
import ProductService from "../../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useHistory } from "react-router-dom";
import OurFamily from "./OurFamily";

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

export default function Products(props: ProductProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [searchText, setSearchText] = useState<string>("");
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: ProductCollection.DISH,
  });

  const history = useHistory();
  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = searchText;
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  // HANDLERS

  const searchCollectionHandler = (collection: ProductCollection) => {
    productSearch.page = 1;
    productSearch.productCollection = collection;
    setProductSearch({ ...productSearch });
  };

  const searchOrderHandler = (order: string) => {
    productSearch.page = 1;
    productSearch.order = order;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };
  console.log(products.length);

  return (
    <div className="products">
      <Container>
        <Stack className="main-page">
          <Box className="title">Tandir Restaurant</Box>

          <Stack className="top">
            <Stack flexDirection={"row"} justifyContent={"flex-end"}>
              <Button
                variant="contained"
                color={
                  productSearch.order === "createdAt" ? "primary" : "secondary"
                }
                onClick={() => searchOrderHandler("createdAt")}
              >
                NEW
              </Button>
              <Button
                variant="contained"
                color={
                  productSearch.order === "productPrice"
                    ? "primary"
                    : "secondary"
                }
                sx={{ marginLeft: "20px" }}
                onClick={() => searchOrderHandler("productPrice")}
              >
                PRICE
              </Button>
              <Button
                variant="contained"
                color={
                  productSearch.order === "productViews"
                    ? "primary"
                    : "secondary"
                }
                sx={{ marginLeft: "20px" }}
                onClick={() => searchOrderHandler("productViews")}
              >
                VIEWS
              </Button>
            </Stack>
            <Box className="search">
              <input
                type="search"
                placeholder="Type here..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProductHandler();
                }}
              />

              <Button
                className="search-btn"
                endIcon={<Search />}
                variant="contained"
                sx={{ borderRadius: "20px" }}
                onClick={searchProductHandler}
              >
                Search
              </Button>
            </Box>
          </Stack>

          <Stack className="collection" flexDirection={"row"}>
            <Stack className="kind" flexDirection={"column-reverse"}>
              <Button
                variant="contained"
                className="kind-btn"
                color={
                  productSearch.productCollection === ProductCollection.OTHER
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.OTHER)}
              >
                <RestaurantMenu />
                OTHER
              </Button>
              <Button
                variant="contained"
                className="kind-btn"
                color={
                  productSearch.productCollection === ProductCollection.DESERT
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  searchCollectionHandler(ProductCollection.DESERT)
                }
              >
                {" "}
                <Cake />
                DESERT
              </Button>
              <Button
                variant="contained"
                className="kind-btn"
                color={
                  productSearch.productCollection === ProductCollection.DRINK
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.DRINK)}
              >
                <LocalBar />
                DRINK
              </Button>
              <Button
                variant="contained"
                className="kind-btn"
                color={
                  productSearch.productCollection === ProductCollection.SALAD
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.SALAD)}
              >
                {" "}
                <DinnerDining />
                SALAD
              </Button>
              <Button
                variant="contained"
                className="kind-btn"
                color={
                  productSearch.productCollection === ProductCollection.DISH
                    ? "primary"
                    : "secondary"
                }
                onClick={() => searchCollectionHandler(ProductCollection.DISH)}
              >
                <KebabDining />
                DISH
              </Button>
            </Stack>
            <Stack className="meals">
              {products.length ? (
                products.map((product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  const sizeVolume =
                    product.productCollection === ProductCollection.DRINK
                      ? product.productVolume + " L"
                      : product.productSize + " SIZE";
                  return (
                    <Stack
                      className="meal"
                      key={product._id}
                      onClick={() => chooseProductHandler(product._id)}
                    >
                      <Box className="normal">{sizeVolume}</Box>
                      <Button
                        className="shop-btn"
                        onClick={(e) => {
                          e.stopPropagation();
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
                      </Button>
                      <Button className="view-btn">
                        <Badge
                          badgeContent={product.productViews}
                          color="secondary"
                        >
                          <RemoveRedEye
                            sx={{
                              color:
                                product.productViews === 0 ? "gray" : "white",
                            }}
                          />
                        </Badge>
                      </Button>
                      <img
                        className="main-img"
                        src={imagePath}
                        alt={product.productName}
                      />

                      <Box>{product.productName}</Box>
                      <Box className="price">${product.productPrice}</Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className="no-data">Products are not available</Box>
              )}
            </Stack>
          </Stack>
          {products.length >= 8 || productSearch.page > 1 ? (
            <Stack justifyContent={"center"} flexDirection={"row"}>
              <Pagination
                count={
                  products.length !== 0
                    ? productSearch.page + 1
                    : productSearch.page
                }
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
          ) : (
            ""
          )}
        </Stack>
        <OurFamily />
      </Container>

      <Stack className="map">
        <Box className="text">Our address</Box>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12142.026202273995!2d71.19925970730726!3d40.46405729290824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb023fd399c4a1%3A0x338eb920657f744!2z0KHQtdGA0L7QstCwLCDQpNC10YDQs9Cw0L3RgdC60LDRjyDQntCx0LvQsNGB0YLRjCwg0KPQt9Cx0LXQutC40YHRgtCw0L0!5e0!3m2!1sru!2s!4v1745557563337!5m2!1sru!2s"
          width="600"
          height="450"
          loading="lazy"
        ></iframe>
      </Stack>
    </div>
  );
}
