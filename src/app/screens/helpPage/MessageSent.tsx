import { Box, Button, Stack } from "@mui/material";
import React, { useState } from "react";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobal } from "../../hooks/useGlobal";
import { Messages } from "../../../lib/config";
interface TgMessage {
  memberNick: string;
  memberPhone: string;
  memberMessage: string;
}

const TelegramForm: React.FC = () => {
  const { authMember } = useGlobal();

  const [message, setMessage] = useState<TgMessage>({
    memberNick: authMember ? authMember.memberNick : "",
    memberPhone: authMember ? authMember.memberPhone : "",
    memberMessage: "",
  });

 const sendMessageToTelegram = async (input: TgMessage) => {
  const BOT_TOKEN = "1115526529:AAErzbN-KViofQP-VLMgfSmgTjR3crYEh6I";
  const CHAT_ID = "637234125";
  const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    if (!authMember) throw new Error(Messages.error2);

    const formattedMessage = `*New Message*\n\n*Name:* ${input.memberNick}\n*Phone:* ${input.memberPhone}\n*Message:*\n${input.memberMessage}`;

    const response = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: formattedMessage,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    sweetTopSmallSuccessAlert("Message sent!");
  } catch (err) {
    console.error(err);
    sweetErrorHandling(err);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageToTelegram(message);
    setMessage({
      memberNick: authMember ? authMember.memberNick : "",
      memberPhone: authMember ? authMember.memberPhone : "",
      memberMessage: "",
    });
  };

  return (
    <Stack className={"admin-letter-box"}>
      <Stack className={"admin-letter-container"}>
        <Box className={"admin-letter-frame"}>
          <span>Contact us!</span>
          <p>Fill out below form to send a message!</p>
        </Box>

        <form className={"admin-letter-frame"} onSubmit={handleSubmit}>
          <div className={"admin-input-box"}>
            <label>Your name</label>
            <input
              type={"text"}
              name={"memberNick"}
              placeholder={"Type your name here"}
              value={message.memberNick}
              onChange={(e) =>
                setMessage({ ...message, memberNick: e.target.value })
              }
            />
          </div>
          <div className={"admin-input-box"}>
            <label>Your Phone</label>
            <input
              type={"text"}
              name={"memberPhone"}
              placeholder={"Type your phone here"}
              value={message.memberPhone}
              onChange={(e) =>
                setMessage({ ...message, memberPhone: e.target.value })
              }
            />
          </div>
          <div className={"admin-input-box"}>
            <label>Message</label>
            <textarea
              name={"memberMsg"}
              placeholder={"Type Your message"}
              value={message.memberMessage}
              onChange={(e) =>
                setMessage({ ...message, memberMessage: e.target.value })
              }
              required
            ></textarea>
          </div>
          <Box display={"flex"} justifyContent={"flex-end"} sx={{ mt: "30px" }}>
            <Button type={"submit"} variant="contained">
              Send
            </Button>
          </Box>
        </form>
        {/* {status && <p>{status}</p>} */}
      </Stack>
    </Stack>
  );
};

export default TelegramForm;
