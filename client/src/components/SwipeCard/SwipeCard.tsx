import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import TelegramIcon from '@mui/icons-material/Telegram';
import ChatIcon from '@mui/icons-material/Chat';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { ReactNode, useState } from 'react';
import { FC } from "react";
import { Dispatch } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';

interface SwipeCardProps {
    name: string;
    imageSrc: string;
    // тэги это овальные элементы с тексовой информацией
    mainTags: string[];
    intentionTags: string[];
    description: string;
    hobbiesTags: string[];
    setOpenModal: Dispatch<string | null>;
    socialMedia: Map<string, string>;
    isOwnProfile?: boolean | undefined;
}

const SwipeCard: FC<SwipeCardProps> = ({name, imageSrc, mainTags, intentionTags, description, hobbiesTags, setOpenModal, socialMedia, isOwnProfile}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  let socialMediaJSX: ReactNode[] = [];
  if (socialMedia && socialMedia.size > 0) {
    socialMediaJSX = [];
    socialMedia.forEach((val, key, map) => {
      socialMediaJSX.push(
        <Link to={val} target="_blank" rel="noopener noreferrer" >
          <Chip icon={key === 'tg' ? <TelegramIcon /> : (key === 'vk' ? <FormatBoldIcon /> : <ChatIcon />)} label={key === 'tg' ? 'ТЕЛЕГРАМ' : (key === 'vk' ? 'ВКОНТАКТЕ' : 'СОЦ. СЕТЬ') } variant="outlined" color="secondary" key={key} />
        </Link>
      )
    })
  }
  //console.log('social media JSX:', socialMediaJSX, socialMedia)
  const thereIsSocialMedia = socialMediaJSX != undefined && socialMediaJSX.length > 0
  return (
    <Card
      sx={{
        width: "90vw",
        maxWidth: "470px",
        height: "65vh",
        minHeight: "370px",
        overflowY: "scroll",
      }}
    >
      {!imageLoaded && <Skeleton variant="rectangular" height="400px" />}
      <CardMedia
        component="img"
        alt="Изображение пользователя"
        src={imageSrc}
        sx={{
          position: "sticky",
          top: 0,
          opacity: imageLoaded ? "1" : "0",
          height: '400px',
        }}
        onLoad={(prev) => setImageLoaded(true)}
      />
      <CardContent
        sx={{
          position: "relative",
          backdropFilter: "blur(30px)",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            flexDirection: "row",
            gridTemplateColumns: "1fr auto auto",
          }}
        >
          <Typography mb={2} variant="h5" noWrap component="div">
            {name}
          </Typography>
          {
            !isOwnProfile && <Tooltip title="Пожаловаться">
              <IconButton size="small" sx={{ height: "fit-content" }} onClick={() => setOpenModal('complaint')}>
                <FlagOutlinedIcon />
              </IconButton>
            </Tooltip>
          }
          {
            isOwnProfile && <Tooltip title="Редактировать анкету">
              <IconButton size="small" sx={{ height: "fit-content" }} onClick={() => setOpenModal('edit-profile')}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          }
          {
             !isOwnProfile && thereIsSocialMedia && (
              <Tooltip title="Отменить метч">
                <IconButton size="small" sx={{ height: "fit-content" }} onClick={() => setOpenModal('remove-match')}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            )
          }
        </Box>

        <Stack mb={2} spacing={1} direction="row" useFlexGap flexWrap="wrap">
            {
                mainTags.map(tag => {
                    return (
                        <Chip label={tag} variant="outlined" key={tag} />
                    )
                })
            }
            {
                intentionTags.map(tag => {
                    return (
                        <Chip label={tag} variant="outlined" color={tag.toLowerCase().includes('дру') ? 'success' : 'error'} key={tag} />
                    )
                })
            }
        </Stack>
        <Typography variant="subtitle1" mb={1}>
          О себе
        </Typography>
        <Typography
          variant="body2"
          mb={2}
          sx={
            {
              /*overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",*/
            }
          }
        >
          {description}
        </Typography>

        <Typography variant="subtitle1" mt={1} mb={1}>
          Хобби
        </Typography>
        <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
            {
                hobbiesTags.map(hobby => {
                    return (
                        <Chip label={hobby} key={hobby} variant="outlined" />
                    )
                })
            }
        </Stack>
        {
          thereIsSocialMedia && (
            <>
              <Typography variant="subtitle1" mt={1} mb={1}>
                Соц. сети
              </Typography>
              <Stack spacing={1} direction="row" useFlexGap flexWrap="wrap">
                {socialMediaJSX != undefined && socialMediaJSX}
              </Stack>
            </>
          )
        }
      </CardContent>
    </Card>
  );
}

export default SwipeCard;