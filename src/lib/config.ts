
export const serverApi: string = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fullfil all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpg, jpeg and png allowed!",
  error6: "Please upload payment cheque!",
  error7: "Please insert your address!",
};

export const sendMessageToTelegram = async (message: string) => {
  const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

  await fetch(TELEGRAM_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: `${process.env.CHAT_ID}`,
      text: message,
    }),
  });

};
