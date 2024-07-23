import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Mikhail from "../../static/images/Mikhail.jpg";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useState } from 'react';
import { FC } from "react";

interface SwipeCardProps {
    name: string;
    imageSrc: string;
    // тэги это овальные элементы с тексовой информацией
    mainTags: string[];
    intentionTag: string;
    description: string;
    hobbiesTags: string[];
}

const SwipeCard: FC<SwipeCardProps> = ({name, imageSrc, mainTags, intentionTag, description, hobbiesTags}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      sx={{
        width: "90vw",
        maxWidth: "570px",
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
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            flexDirection: "row",
            gridTemplateColumns: "1fr auto",
          }}
        >
          <Typography mb={2} variant="h5" noWrap component="div">
            {name}
          </Typography>
          <IconButton size="small" sx={{ height: "fit-content" }}>
            <FlagOutlinedIcon />
          </IconButton>
        </Box>

        <Stack mb={2} spacing={1} direction="row" useFlexGap flexWrap="wrap">
            {
                mainTags.map(tag => {
                    return (
                        <Chip label={tag} variant="outlined" />
                    )
                })
            }
          <Chip label={intentionTag} variant="outlined" color="success" />
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
                        <Chip label={hobby} variant="outlined" />
                    )
                })
            }
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SwipeCard;