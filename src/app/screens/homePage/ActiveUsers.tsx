import { Box, Container, Stack } from "@mui/material";
import { CssVarsProvider } from "@mui/joy/styles";
import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
} from "@mui/joy";

import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";

const topUsersRetriever = createSelector(retrieveTopUsers, (topUsers) => ({
  topUsers,
}));

export default function ActiveUsers() {
  const { topUsers } = useSelector(topUsersRetriever);
  
  return ( 
    <div className="active-users">
      <Container>
        <Stack className="active-section">
          <Box className="title">Active Users</Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {topUsers.length ? (
                topUsers.map((member: Member) => {
                  const imagePath = `${serverApi}/${member.memberImage}`;

                  return (
                    <Card className="card" key={member._id}>
                      <CardOverflow>
                        <AspectRatio ratio={1}>
                          <img src={imagePath} alt={member.memberNick} />
                        </AspectRatio>
                      </CardOverflow>

                      <Stack>
                        <p className="user">
                          {member.memberNick}
                        </p>
                      </Stack>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">Active Users are not available</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
