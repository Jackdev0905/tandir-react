import { Box } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import { useGlobal } from "../../hooks/useGlobal";
import { useState } from "react";
import { MemberUpdateInput } from "../../../lib/types/member";
import { T } from "../../../lib/types/common";
import { Messages, serverApi } from "../../../lib/config";
import MemberService from "../../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";

export function Settings() {
  const { authMember, setAuthMember } = useGlobal();
  const [image, setImage] = useState<string>(
    authMember?.memberImage
      ? `${serverApi}/${authMember.memberImage}`
      : "/icons/default-user.svg"
  );

  const [updateMember, setUpdateMember] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick,
    memberPhone: authMember?.memberPhone,
    memberPassword: authMember?.memberPassword,
    memberAddress: authMember?.memberAddress,
    memberImage: authMember?.memberImage,
    memberDesc: authMember?.memberDesc,
  });

  // Handlers

  const memberNickHandler = (e: T) => {
    updateMember.memberNick = e.target.value;
    setUpdateMember({ ...updateMember });
  };

  const memberPhoneHandler = (e: T) => {
    updateMember.memberPhone = e.target.value;
    setUpdateMember({ ...updateMember });
  };

  const memberAddressHandler = (e: T) => {
    updateMember.memberAddress = e.target.value;
    setUpdateMember({ ...updateMember });
  };

  const memberDescHandler = (e: T) => {
    updateMember.memberDesc = e.target.value;
    setUpdateMember({ ...updateMember });
  };

  const handleSubmitButton = async () => {
    try {
      if (
        updateMember.memberNick === "" ||
        updateMember.memberAddress === "" ||
        updateMember.memberDesc === "" ||
        updateMember.memberPhone === ""
      )
        throw new Error(Messages.error3);

      const member = new MemberService();
      const result = await member.updateMember(updateMember);
      setAuthMember(result);

      await sweetTopSmallSuccessAlert("Successfully modified!", 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageViewer = (e: T) => {
    const file = e.target.files[0];
    const fileType = file?.type;
    const validImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validImageTypes.includes(fileType))
      sweetErrorHandling(Messages.error5);
    if (file) {
      updateMember.memberImage = file;
      setUpdateMember({ ...updateMember });
      setImage(URL.createObjectURL(file));
    }
  };
  return ( 
    <Box className={"settings"}>
      <Box className={"member-media-frame"}>
        <img src={image} className={"mb-image"} />
        <div className={"media-change-box"}>
          <span>Upload image</span>
          <p>JPG, JPEG, PNG formats only!</p>
          <div className={"up-del-box"}>
            <Button component="label" onChange={handleImageViewer}>
              <CloudDownloadIcon />
              <input type="file" hidden />
            </Button>
          </div>
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Username</label>
          <input
            className={"spec-input mb-nick"}
            type="text"
            placeholder={"MemberNick"}
            value={updateMember?.memberNick}
            name="memberNick"
            onChange={memberNickHandler}
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"short-input"}>
          <label className={"spec-label"}>Phone</label>
          <input
            className={"spec-input mb-phone"}
            type="text"
            placeholder={"phone number"}
            value={updateMember?.memberPhone}
            name="memberPhone"
            onChange={memberPhoneHandler}
          />
        </div>
        <div className={"short-input"}>
          <label className={"spec-label"}>Address</label>
          <input
            className={"spec-input  mb-address"}
            type="text"
            placeholder={"address"}
            value={updateMember?.memberAddress}
            onChange={memberAddressHandler}
            name="memberAddress"
          />
        </div>
      </Box>
      <Box className={"input-frame"}>
        <div className={"long-input"}>
          <label className={"spec-label"}>Description</label>
          <textarea
            className={"spec-textarea mb-description"}
            placeholder={"description"}
            value={updateMember?.memberDesc}
            onChange={memberDescHandler}
            name="memberDesc"
          />
        </div>
      </Box>
      <Box className={"save-box"}>
        <Button variant={"contained"} onClick={handleSubmitButton}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
