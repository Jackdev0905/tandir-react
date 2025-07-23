import { Box, Container, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { plans } from "../../../lib/data/plans";
import { useEffect, useState } from "react";
import MemberService from "../../../services/MemberService";
import { Event } from "../../../lib/types/event";
import { serverApi } from "../../../lib/config";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    const eventservice = new MemberService();
    eventservice
      .getAllEvents()
      .then((data) => {
      setEvents(data);
        console.log("events:", data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className={"events-frame"}>
      <Container className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>Events</span>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={3}
          centeredSlides={true}
          spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 1500,
            disableOnInteraction: true,
          }}
        >
          {events.map((value, number) => {
            const imagePath = `${serverApi}/${value.eventImage}`;
            return (
              <SwiperSlide
                key={number}
                className={"events-info-frame"}
                style={{ zIndex: 2 }}
              >
                <div className={"events-img"}>
                  <img src={imagePath} className={"events-img"} />
                </div>
                <Box className={"events-desc"}>
                  <Box className={"events-bott"}>
                    <Box className={"bott-left"}>
                      <div className={"event-title-speaker"}>
                        <strong>{value.eventTitle}</strong>
                        <div className={"event-organizator"}>
                          <img src={"/icons/speaker.svg"} />
                          <p className={"spec-text-author"}>
                            {value.eventAuthor}
                          </p>
                        </div>
                      </div>

                      <p className={"text-desc"}> {value.eventDesc} </p>

                      <div className={"bott-info"}>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/calendar.svg"} />
                          {value.eventDate}
                        </div>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/location.svg"} />
                          {value.eventLocation}
                        </div>
                      </div>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <Box className={"prev-next-frame"}>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-prev"}
          />
          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-next"}
            style={{ transform: "rotate(-180deg)" }}
          />
        </Box>
      </Container>
    </div>
  );
}
