import styled from "styled-components";
import { useState } from "react";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import firebase from "firebase";
import { postArticleAPI } from "../Actions";

const PostModal = (props) => {
  const [editorText, setEditorText] = useState("");
  const [shareImage, setShareImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");

  const handleChange = (e) => {
    const image = e.target.files[0];

    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    setShareImage(image);
  };
  const switchAssetArea = (area) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const postArticle = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }

    const payload = {
      image: shareImage,
      video: videoLink,
      user: props.user,
      description: editorText,
      timestamp: firebase.firestore.Timestamp.now(),
    };
    props.postArticle(payload);
    reset(e);
  };

  const reset = (e) => {
    setShareImage("");
    setVideoLink("");
    setAssetArea("");
    setEditorText("");
    props.handleClick(e);
  };

  return (
    <>
      {props.showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <button onClick={(event) => reset(event)}>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz85hzTu-s2ggnUSl3LvdF6INiIZy-MWylRQ&usqp=CAU" />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {props.user.photoURL ? (
                  <img src={props.user.photoURL} />
                ) : (
                  <img src="/images/user.svg" />
                )}
                <span>{props.user.displayName}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about..."
                  autoFocus={true}
                />
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif,image/jpeg, image/png"
                      name="image"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor="file">Select an image to share</label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === "media" && (
                    <>
                      <input
                        type="text"
                        placeholder="Please input a video link"
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {videoLink && (
                        <ReactPlayer width={"100%"} url={videoLink} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>
            <SharedCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <img src="data:image/png;base64,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" />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("media")}>
                  <img src="data:image/jpeg;base64,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" />{" "}
                </AssetButton>
              </AttachAssets>
              <ShareComment>
                <AssetButton>
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8AAAABAQGAgICkpKSrq6uIiIjn5+cKCgrs7OxUVFTKysrExMReXl78/Pz4+Pjf3994eHjQ0NAYGBg5OTlKSkq8vLzy8vJycnKNjY0+Pj6cnJwWFha2trbc3NxDQ0MkJCRnZ2cgICCUlJRQUFAzMzNra2srKysjIyPg8eRJAAALL0lEQVR4nO1di9qqKhAVNc0yzDLtavfa7/+ER7DS4VJWmvgf1rf3n2XSLAcYZsDBMDQ0NDQ0NDQ0NDQ6BYzbluCBBkRRh1yBGmWiRSXDVTiIdtN+25juotN8NUzqJBl4fhgh1XAOfS+ogx52/XBNizRVApVoHfrut2rEk9XswQ7dCm4bVJIby9lq8hXH4SJCOT2kBrkCOcvsIFoMP+bn3vm1zUaKO8fxZwQ3M6Q2P4JcvlnvbXbY8OZFASrjJuDcfc90YGOyy6t6y/JXQd5J/Ju8RTHodYYfQc6x94Z1TI4ImepX0AK5sMekKkHXohrkSlHH5vPVi8pruRUJhnwPcy9ZDYikoe/DShQ9iyNoqtepUnlM7hPLe8kPB0eGTnG8DW0/HbvtYpz6drh9CMdSPAYvelRs9IQE+5H1+dioCQytaA3v/03u3iujMeQIZm+u+w3tiRXx8nMxgs3+KhL2hSbcHa/B6SWm5TYv+hug0sSXKa/F3fPe5lI2E3l/deolqtHLgcnI5AQtN5H+8uyiTbnx5iMFK1WTH0EmV2rB0Rc52MivcLelOkoJ9leVxwktIVn1yxSJ/Ft5PV0AFZLDJ7dDGWzACIwcLGRfHUZlA0Nui69sBS2ADR90N9lRJOlPscO0wv6mAwQJxU2faYmOWO5JVP5edrTqBEFCcYWg6NFE+L3y1+gYr5Zo5E8QWIzsK5FuxjPYIw0+DO+0gvEAKnEmEj6GjXDa60YVzYF7U9gUY/4rSQjdyrnqhhAimZdkz4iECacgdwpsypW/CWojvgJbfuCtfrmSEhW2IOR3AErkqynGpUpK/IlumMICmVGcFjoi1ZR19fAZ9DPb7liKO4It6GvOrIY82JM6rQhZDbLKZcHelI3Y+EDFmaPcrUpKeA8RaGg+c/oIxwRf/NTQGg0axCiMZTcfjmuOQEmYOveFimefExyhxjGQmOoZ4HBhquEW8Lc+raR4WQSHTFR+Yd4+/fTJybxwEUVcbogmr6UrOPsyJCdDiNhAbd2g5Z+EDHuAw5U5vwYjmk9jo8MzapjgrfhYpIIhGNWsmbPgJEo/ZHjsN04wD1kIh1wpJPGUYcU5HA7WDwjSKiiqpob7BsPX8xtiMP5JcwyFnb33A4bOr3Q4aIthb/qjdrgQ9TS/YOgNmp/+N8Xe348YGvGhmEZoyuKbZAqtNYbG5t9nmnkH05X4t3/DMBt4X5vld5jLht4/Ymgk6WTYICapVLhfMWwPmqFmqD40Q81QfWiGmqH60Aw1Q/WhGWqG6kMz1AzVh2ZYhSEerhyrXTiroWxuswaGgRX1UdvoR7JFkzUwfDyqUlMA+7NLENo2xXAEf6cdmOTfqAmGdL1K+wRvEgjX+3ytQ7IKoX2CiEoRNqBDwxj8ZIK3AhqbIZ0pxLCZWe6/rkO65EiZdihctPW1DlOkBEUqg3DBz7cMMXksqv3HgakEwoUKdYxpwvbHbAR9oa2ohSG2R+t2SJUwHdlNznKP417biKXP8mj/UDNUH5qhZqg+NEPNUH1ohpqh+tAMNUP1oRlqhupDM9QMKdK4Z7eLXix9/LOOaOJq0H40cT0Qpteph+FckYiwJC3J91F9R5movtNMVP+vz8z8H2bX/voM6R+b5RY+Zqu8Dt95Hl/YkJVfbQJzKpjMWZgXwxcVoNaKIQFgFqEDc/YM8oLYQnuzz0+2CyrAXiAdNmzAYcmcP4Gzc3H2llPxO6IX8adPT35yCRJnxcDGHCSK2jM5hualAnj+NwTOsv1xW38pW325BBwchuEKZJFCsmRmE3vhtIuFLczcSe4/AtpnM85NQCvtRPJZCJiKVmDxEgRULFnPoTRCwODAqgiXKjFJ4tqtzJcESQQ7GiarIEyUlbmZH+fCagmZrViDhsYTmJSrKUKjriVODMqJ4oQDT6+cGhKhw/v7C7WL3gGocMQ3s8CB45X9p9mw2oG7hyoU5QgGna2J+rLVY0oC230g/VnkO7gjmB0z+jRpWxtIy+nkSSBHaAtsBCkKqrKqSEYIGLuDOAvyBCRxzY4+zg/5Y2DDYpQzl4RDVwjeCclSXNVwW7xcIriTbemQzsDQLTvsRG+DYfMiKpQa81UftNfsUPkNPMgWHiCOS/J6ylN35gnlHl8lNqPqRl+twbX6pZ1m6Kt0Aw+DDcXQ60a+0vvM+CMw1UAUtHxa7xwQT6OXnh1PTY6ZTIlzhnMp5FDmIecIzjBkSC+O7FuBCoH6RnaEEBhrVtl3xO0LKKLd0X0U2z5yMbzjDrEEs//hi43XsOGvuV276LuBnXrJq23bfgIcJN7YHtyaHUNw9HKCHgf2lJklNO83Kto79sb/FsP0YwsUjCd+vLGdfXTXHiNntY1VktWUDd+byKxxavTsPO8LpBgfS49amyYnJEKnat5CcuwjNs9qsT9mHdhuPokgTEZPZKF8Z1XdIWaUAPB+jJo9SSSbWuO3++bxIL9YKBclPKs+OsGNbpZLOc6Ekz9PRMr31pSV+K63lz+Z3tiqhLxgB7+lRvf8jGCGxVs1HxveyETym/Y1RXLPr+N3GDKxQJbf8s06kVFMjhGqtQtlxKIJj9+oV76EIS1o90G7zjAkC4Qao5j74mlluYayO5X9vUg39XgBLx7cCmmAZl5Tt72g4s1PWR0+jPSg94WHN96c7jeqAVWSYg/VtmHORLnC+MO9AY02X+4P58V5RhPxbthfUyRqjCv5LS7cYyUXZW1NalgoisfHf2WZzPwnEP9SweLzIxGE+k4Fitgr74RDD9f7uB5nhxTi2vtoN61lhpvb8jt7u6wwUA0WQIdR3vhq8nXyYsbxygkv+9FX2LIU87o/fW03yDirxJAMYGp1V+sqaxwe2HFE3qnOX6qxbBDNSmp/G7XcsqS35RxXqtXlqx0lJ4cyQ4V3L8TpnB/W58tin3f7ZCPY4oqpyvObSY8fDuY7gD/VC9lqtNAhkuwAoQjSK6fG3G1cPBnheHMw6ngW9m0dmEw4CzrVDMtUSjFYgM5UNr2kDOKZwPyTt7bUbtjQXCi+mS82xtaabY3527lMdLI3dcFw24S5qBfBhndA8xHORqxG/1pmuHvX5W0DE95uUMIHS6hGMkdduhVd2Nje8Ow1Yl0WqsaTyN8Yj4C5UNkgljCcCdSIiBp5imDbZoSOHVm1FVimeIRz5muq0y1z8UC85O0G/WezSlqBsXeH9n535+xc0N3fYOJUZN+6gmF3VjRlLGyh25jHqUrfi69lhmv1DWIBfLcb5VgTebcGdmOyBJ1pFwxigbvd4Dqcsr/hnsAXXjmUigHna++YkCgJZxfzEbhkELOjhRIz0pWByUp0hAQjHDLteaMSgs70knSKIYEficOND39jAeKJ284YxDuw4YZTcad6SY37YvWCoXirTqWBH3EqjuLVT8g6ERCMQt0x+WVQuyFSI4lTpcB/+nhv7Zbh2RKKA98IQLhN8gyh+sATkb9B7YYxAOaiK2uYeXgWZzdu6yTh/NNIkVVon8BfitUIOKNrdwkSu9EXzW+ApaHypyQ7AOJvcG4jz7B7BhFgyNsNppZ28DlQCM/eFesiBQzNl4tllQcenvhpqrISJY+cdwmBJaeYfSp8ar1r8NeyVUsmnzahi8gG45cpEjfGbpuLB7AR2Jy/8WDYmXDbCwj8jRtDNqtAZ5HHqQQUO28uHsApP1AlH3QxMYIY2PAcxHY4pmzvrq7CP7McTdkGbN0E8TegbTT/GEODLG1blpVomsJcQ93G5FJokfztWvaOCqD+hnl7bAad/8KYhoM/QHeCL56l7Cy8+2T39Y8SNEhr7CN0Pnp/rxGW8Je5EeDHHw0NDQ0l8B8glbY9hc8cXwAAAABJRU5ErkJggg==" />
                  Anyone
                </AssetButton>
              </ShareComment>
              <PostButton disabled={!editorText ? true : false}
              onClick={(event) => postArticle(event)}
              >
                Post
              </PostButton>
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 20px;
    /* background-color: none; */
    pointer-events: none;
  }

  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);
  }
`;
const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border-radius: 50%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 7px;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  img {
    height: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.5);
  }
  display: flex;
  align-items: center;
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
  }
`;

const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  ${AssetButton} {
    img {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.8)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgba(1,1,1,0.2)" : "white")};
  &:hover {
    background: ${(props) => (props.disabled ? "rgba(0,0,0,0.08)" : "#004182")};
  }
`;

const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
  }

  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postArticle:(payload) => dispatch(postArticleAPI(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
