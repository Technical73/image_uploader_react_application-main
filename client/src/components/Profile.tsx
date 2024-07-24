import Cover from "../assets/Profile_Images_and_Icons/cover.png";
import Avatar from "../assets/Profile_Images_and_Icons/avatar.png";
import Logo from "../assets/Profile_Images_and_Icons/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { uploadCardOpen } from "../features/upload_card_triggers";
import { RootState } from "../store/image_upload_store";

const Profile = () => {
  let dispatch = useDispatch();
  let selectImage = useSelector(
    (state: RootState) => state.selectedImage.image_name
  );
  console.log(selectImage);

  let handleNavigate = () => {
    dispatch(uploadCardOpen());
  };

  return (
    <>
      {/* main container starts from here */}

      {/* profile card starts from here */}
      <div className="card">
        {/* background image starts from here */}
        <img src={Cover} alt="cover_image" className="cover_img_styles" />
        {/* background image ends over here */}
        {/* Profile image, details and Update profile button starts from here */}
        <div className="profile_details_main">
          {/* profile img and button start*/}
          <div className="profile_img_update_btn_container">
            {/* Profile Image start*/}

            {selectImage !== "" ? (
              <>
                <img
                  src={`http://localhost:8000/images/${selectImage}`}
                  alt="avatar_img"
                  className="avatar_img_style"
                />
              </>
            ) : (
              <>
                <img
                  src={Avatar}
                  alt="avatar_img"
                  className="avatar_img_style"
                />
              </>
            )}
            {/* Profile Image end */}
            {/* update button starts */}

            <button
              type="button"
              className="update_button_style"
              onClick={handleNavigate}
            >
              Update picture
            </button>

            {/* update button ends */}
          </div>
          {/* profile image and button end */}

          {/* profile details start */}
          <div className="profile_details_container">
            {/* profile name starts */}
            <h3>Jack Smith</h3>
            {/* profile name ends */}

            {/* profile bio starts */}
            <div className="profile_bio_container">
              <span className="username">@kingjack</span>
              <span className="dot1">•</span>
              <span className="position">Senior Product Designer</span>
              <div className="break">
                <span className="at">at</span>
                <img src={Logo} alt="logo" className="logo_styles" />
                <span className="position">Webflow</span>

                <span className="dot2">•</span>
                <span className="he_him">He/Him</span>
              </div>
            </div>
            {/* profile bio ends */}
          </div>
          {/* profile details end */}
        </div>

        {/* Profile image, details and Update profile button ends here */}
      </div>
      {/* proile card ends over here */}

      {/* main container ends over here */}
    </>
  );
};

export default Profile;
