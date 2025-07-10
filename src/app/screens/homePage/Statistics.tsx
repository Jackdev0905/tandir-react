import { Box, Container, Stack } from "@mui/material";
import Divider from "../../components/divider";

export default function Statistics() {
  return (
    <div className="statistics">
      <Container>
        <Stack className="info">
          <Box className="box">
            <h2>12</h2>
            <p>Restaurants</p>
          </Box>
          <Divider height="64" width="2" bg="#e3c08d" />
          <Box className="box">
            <h2>8</h2>
            <p>Experience</p>
          </Box>
          <Divider height="64" width="2" bg="#e3c08d" />

          <Box className="box">
            <h2>50+</h2>
            <p>Menu</p>
          </Box>
          <Divider height="64" width="2" bg="#e3c08d" />

          <Box className="box">
            <h2>200+</h2>
            <p>Clients</p>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
