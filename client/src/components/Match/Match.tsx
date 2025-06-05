import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useTheme } from "@mui/material/styles";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";

import { API_URL } from "../../constants";
import { cardObjToSwipeCard } from "../cardObjToSwipeCard";
import { cardObj, modalStyle } from "../cardObjInterface";
import { updateTokens } from "../updateTokens";

import { useNavigate } from "react-router-dom";
import { Dispatch, useEffect, useState } from "react";
import axios from "axios";
import ComplaintModal from "../ComplaintModal";

import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";

export default function Match({
  setCurrentPage,
  openModal,
  setOpenModal,
  setLoggedIn,
}: {
  setCurrentPage: Dispatch<string>;
  openModal: string | null;
  setOpenModal: Dispatch<string | null>;
  setLoggedIn: Dispatch<boolean>;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[] | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [openedCard, setOpenedCard] = useState<cardObj | null>(null);

  console.log("check", openedCard);
  const noMatchesMessage = "Мэтчей пока что нет.";
  function getMatches() {
    axios
      .get(`${API_URL}/getMatch/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then(function (response) {
        if (response.status === 204) {
          // no matches
          setInfoMessage(noMatchesMessage);
        } else {
          setMatches(response.data.users);
          console.log("matches are: ", response);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.status === 401) {
          updateTokens()
            .then((res) => getMatches())
            .catch((err) => {
              setLoggedIn(false);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              navigate("/");
            });
        }
      });
  }

  function getCard(target_user_id: number) {
    axios
      .post(
        `${API_URL}/getDetailsAboutProfileInMatch/`,
        {
          target_user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(async function (response) {
        console.log("getCard() -> response: ", response);
        if (response.status === 500) {
          // no matches
          setInfoMessage("Ошибка сервера.");
        } else if (response.status === 200) {
          const userDetails = await response.data;
          setOpenedCard({ ...userDetails.user_details });
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error.response.status === 401) {
          updateTokens()
            .then((res) => getCard(target_user_id))
            .catch((err) => {
              setLoggedIn(false);
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              navigate("/");
            });
        }
      });
  }
  function removeOpenedMatchFromState() {
    if (!openedCard || !matches) {
      return;
    }
    if (matches.length === 1) {
      setInfoMessage(noMatchesMessage);
    }
    setMatches(matches.filter((m) => m.id !== openedCard.id));
  }
  function removeMatch() {
    if (!openedCard || !matches) {
      return;
    }
    axios
      .post(
        `${API_URL}/resetMatch/`,
        {
          target_user_id: openedCard.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then(function (response) {
        console.log("removeMatch() -> response: ", response);
        // 200 or 400
        if (response.status === 200) {
          removeOpenedMatchFromState();
          setOpenModal(null);
          setOpenedCard(null);
        } else {
          setInfoMessage("Ошибка сервера.");
        }
      })
      .catch(function (error) {
        console.log(error);
        setInfoMessage("Ошибка сервера.");
      });
  }

  useEffect(() => {
    setCurrentPage("match");
    getMatches();
  }, []);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [profileImageWidth] = useState(60);
  const [profileImageMargins] = useState(theme.spacing(1.5));
  const [cardContentPaddings] = useState(theme.spacing(1.5));
  const [maxCardWidth] = useState(700);

  console.log("openModal", openModal, openedCard);

  // cute gif: https://i.pinimg.com/originals/df/6f/ab/df6fabcd43d699238b0a60e085d38fab.gif
  return (
    <div
      className="wallpaperBackground"
      style={{
        flexGrow: 1,
        display: "grid",
        alignItems: "center",
        justifyItems: "center",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <Modal
        open={openedCard !== null}
        onClose={() => setOpenedCard(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ alignSelf: "center", justifySelf: "center" }}
      >
        <Box style={{ outline: "none" }}>
          {openedCard && cardObjToSwipeCard(openedCard, setOpenModal, true)}
        </Box>
      </Modal>

      {openedCard && openModal === "complaint" && (
        <ComplaintModal
          targetId={openedCard.id}
          openModal={openModal}
          setOpenModal={setOpenModal}
          performSwipe={removeMatch}
        />
      )}

      <Modal
        open={openModal === "remove-match"}
        onClose={() => setOpenModal(null)}
        style={{ alignSelf: "center", justifySelf: "center" }}
      >
        <Card style={{ outline: "none" }} sx={modalStyle}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Вы точно хотите разорвать мэтч с пользователем "
              {`${openedCard?.first_name} ${openedCard?.last_name}`}"?
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Если разорвать мэтч, то пользователь больше не сможет видеть ваш
              профиль на странице метчей.
            </Typography>
          </CardContent>
          <CardActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button color="secondary" onClick={() => setOpenModal(null)}>
              Сохранить
            </Button>
            <Button color="error" onClick={removeMatch}>
              Разорвать
            </Button>
          </CardActions>
        </Card>
      </Modal>

      {infoMessage && (
        <Alert severity="info" style={{ alignSelf: "center" }}>
          {infoMessage}
        </Alert>
      )}
      {!infoMessage && (
        <Card
          sx={{
            background: theme.palette.mode === "dark" ? "#121212" : "#dde1e6",
            width: `clamp(250px, 90vw, ${maxCardWidth}px)`,
            paddingBottom: theme.spacing(1),
            marginBlock: theme.spacing(2),
            maxHeight: "65vh",
            minHeight: "100px",
            overflow: "auto",
          }}
        >
          {matches === null || matches === undefined
            ? [0].map((i) => {
                return (
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      marginInline: theme.spacing(1),
                      marginTop: theme.spacing(1),
                      height: `calc(${profileImageWidth}px + ${profileImageMargins} + ${profileImageMargins})`,
                    }}
                  />
                );
              })
            : matches.map((match, ind) => {
                console.log(match);

                // return <div key={match.id}>{match.first_name} {match.last_name} {match.description}</div>
                return (
                  <Card
                    onClick={() => {
                      getCard(match.id);
                    }}
                    sx={{
                      display: "flex",
                      marginTop: theme.spacing(1),
                      marginInline: theme.spacing(1),
                      alignItems: "center",
                      maxWidth: maxCardWidth,
                    }}
                    style={{ cursor: "pointer", boxShadow: "none" }}
                  >
                    <Skeleton
                      variant="circular"
                      sx={{
                        width: profileImageWidth,
                        height: profileImageWidth,
                        aspectRatio: "1",
                        display: !imageLoaded ? "block" : "none",
                        margin: profileImageMargins,
                        marginRight: 0,
                      }}
                    />
                    <CardMedia
                      component="img"
                      sx={{
                        width: profileImageWidth,
                        height: profileImageWidth,
                        aspectRatio: "1",
                        borderRadius: "50%",
                        margin: profileImageMargins,
                        marginRight: 0,
                        display: imageLoaded ? "block" : "none",
                      }}
                      image={`${API_URL}/${match.image}`}
                      alt="Изображение пользователя"
                      onLoad={() => {
                        if (ind === matches.length - 1) {
                          setImageLoaded(true);
                        }
                      }}
                    />

                    <CardContent
                      style={{
                        width: `calc(100% - ${profileImageWidth}px - ${cardContentPaddings})`,
                        padding: cardContentPaddings,
                      }}
                    >
                      <Typography
                        component="div"
                        variant="h6"
                        noWrap /*style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}*/
                      >
                        {match.first_name} {match.last_name}
                      </Typography>
                      {match.description && (
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                          noWrap
                        >
                          {match.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </Card>
      )}
    </div>
  );
}
