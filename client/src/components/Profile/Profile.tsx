import {
  Autocomplete,
  FormHelperText,
  InputAdornment,
  IconButton,
  Stack,
  Alert,
  Box,
  Modal,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormLabel,
  Paper,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  Portal,
} from "@mui/material";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  useSelectWithFetchedOptions,
  ReactiveSelect,
} from "../useSelectWithFetchedOptions";
import { useTheme } from "@mui/material/styles";
import { Dispatch, useEffect, useState } from "react";
import { cardObjToSwipeCard } from "../cardObjToSwipeCard";
import { cardObj, modalStyle } from "../cardObjInterface";
import axios from "axios";
import { API_URL } from "../../constants";

export default function Profile({
  setCurrentPage,
  openModal,
  setOpenModal,
}: {
  setCurrentPage: Dispatch<string>;
  openModal: string | null;
  setOpenModal: Dispatch<string | null>;
}) {
  const [profileCard, setProfileCard] = useState<cardObj | null>(null);

  async function fetchProfile() {
    await axios
      .get(`${API_URL}/profileData/`, {
        headers: {
          // передача JWT для подтверждения доступа к ресурсу
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        // получение данных профиля
        const profileCard = response.data.user_data;
        // сохранение данных профиля в состояние
        setProfileCard(profileCard);
        // выставление значений для окна редактирования профиля
        firstNameInputProps.setValue(profileCard.first_name);
        lastNameInputProps.setValue(profileCard.last_name);
        descriptionInputProps.setValue(profileCard.description);
        setIsSearchFriend(profileCard.is_search_friend);
        setIsSearchLove(profileCard.is_search_love);
        setIsBoy(profileCard.is_boy);
        tgInputProps.setValue(profileCard.tg_contact);
        vkInputProps.setValue(profileCard.vk_contact);
        emailInputProps.setValue(profileCard.email);
      })
      .catch((err) => console.log("error in profile:", err));
  }

  const [validate, setValidate] = useState(true);
  const [validationError, setValidationError] = useState(false);

  function useFormInput(
    label: string,
    helperText: string,
    pattern: string,
    required?: boolean
  ) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<boolean | undefined>(false);

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
      setValue(ev.target.value);
      setError(
        (!ev.target.validity.valid || (ev.target.value === "" && required)) &&
          validate
      );
    }

    return {
      label: label,
      value: value,
      error:
        (error && validate) || (required ? value === "" && validate : false),
      onChange: onChange,
      helperText:
        validate &&
        (error || (required ? value === "" && validate : false)) &&
        helperText,
      inputProps: { pattern: pattern },
      required: required,
      setValue: setValue,
      setError: setError,
    };
  }

  function fetchSaveData(
    fetchingArrName: string,
    endPointName: string,
    setState: Dispatch<React.SetStateAction<[] | Hobby[]>>
  ) {
    axios
      .get(`${API_URL}/${endPointName}/`)
      .then((response) => {
        if (response.status !== 200) return;
        setState(response.data[fetchingArrName]);
        if (fetchingArrName === "hobbies") {
          setPreselectedHobbies(
            response.data[fetchingArrName].filter((hobby: Hobby) =>
              selectedHobbiesIds.includes(hobby.id)
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // определение типа
  interface Hobby {
    name: string;
    id: number;
  }

  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbiesIds, setSelectedHobbiesIds] = useState<number[]>([]);
  const [preselectedHobbies, setPreselectedHobbies] = useState<Hobby[]>([]);

  const hobbiesToIds = (hobbies: string[]): number[] => {
    if (!allHobbies || allHobbies.length === 0) return [];
    return hobbies.flatMap((hobby) => {
      const hobbyObject = allHobbies.find((h) => h.name === hobby);
      return hobbyObject ? [hobbyObject.id] : [];
    });
  };

  useEffect(() => {
    setCurrentPage("profile");
    fetchProfile()
      .catch((error) => {
        console.error(error);
      })
      .then(() => {
        fetchSaveData("hobbies", "getHobbies", setAllHobbies);
      });

    // let sampleCard = {
    //     id: 123,
    //     first_name: "Рей",
    //     last_name: "Оливер",
    //     sur_name: "Загадка",
    //     course_name: "4 курс",
    //     building_name: "Осн. корпус",
    //     department_name: "ОИТ",
    //     hobbies: ["Лежать на диване", "Ничего не делать"],
    //     is_search_friend: true,
    //     is_search_love: true,
    //     description: "Шла ночь... Смеркалось... Я искал тех, с кем можно разделить минуты горести и печали, скуку и занятость...",
    //     image: "",
    //     tg_contact: "https://t.me/northurljous",
    //     vk_contact: "https://vk.com/smth",
    //     is_boy: true
    // }
    // setProfileCard(sampleCard)
    // firstNameInputProps.setValue(sampleCard.first_name)
    // lastNameInputProps.setValue(sampleCard.last_name)
    // descriptionInputProps.setValue(sampleCard.description)
    // setIsSearchFriend(sampleCard.is_search_friend)
    // setIsSearchLove(sampleCard.is_search_love)
    // setIsBoy(sampleCard.is_boy)
    // setProfileImage(blob_image_of_profile_should_be_here)
  }, []);

  const firstNameInputProps = useFormInput(
    "Имя",
    "Имя должно содержать от 1 до 50 символов",
    ".{1,50}",
    true
  );
  const lastNameInputProps = useFormInput(
    "Фамилия",
    "Фамилия должна содержать от 1 до 50 символов",
    ".{1,50}",
    true
  );
  const descriptionInputProps = useFormInput(
    "О себе",
    'Поле "О себе" должно содержать от 1 до 170 символов',
    ".{1,170}",
    true
  );

  const buildingParams = useSelectWithFetchedOptions("Корпус", "buildings", 1);
  const departmentParams = useSelectWithFetchedOptions(
    "Отделение",
    "departments",
    1
  );
  const courseParams = useSelectWithFetchedOptions("Курс", "courses", 1);

  const vkInputProps = useFormInput(
    "ВКонтакте",
    "Ссылка на профиль ВКонтакте должна начинаться с https://vk.com/",
    "https://vk.com/.*"
  );
  const tgInputProps = useFormInput(
    "Telegram",
    "Ссылка на профиль Телеграм должна начинаться с https://t.me/",
    "https://t.me/.*"
  );
  const emailInputProps = useFormInput(
    "Эл. почта",
    "Введите действительный адрес электронной почты по типу example@mail.com",
    "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
    true
  );
  const passwordInputProps = useFormInput(
    "Пароль",
    "Пароль должен содержать от 8 до 50 символов, среди которых есть только латинские символы (минимум одна заглавная и строчная буквы), минимум одна цифра (0-9) и минимум один символ из набора: !@#$%^&*_=+-",
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*_=\\+\\-]).{8,50}$",
    true
  );
  const [showPassword, setShowPassword] = useState(false);

  const [profileImage, setProfileImage] = useState<Blob | MediaSource>();
  const [searchIntentionError, setSearchIntentionError] = useState(false);
  const [isSearchFriend, setIsSearchFriend] = useState(false);
  const [isSearchLove, setIsSearchLove] = useState(false);
  const [isBoy, setIsBoy] = useState<boolean | null>(false);

  interface Snackbar {
    message: string;
    severity: "error" | "success";
    open: boolean;
  }
  const [snackbar, setSnackbar] = useState<Snackbar | null>(null);

  const snackbarHandleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    snackbar &&
      setSnackbar({
        open: false,
        message: snackbar.message,
        severity: snackbar.severity,
      });
  };

  useEffect(() => {
    setSearchIntentionError(!isSearchFriend && !isSearchLove);
  }, [isSearchFriend, isSearchLove]);

  useEffect(() => {
    if (profileCard && allHobbies) {
      const selectedIds = hobbiesToIds(profileCard.hobbies);
      setSelectedHobbiesIds(selectedIds);
      setPreselectedHobbies(
        allHobbies.filter((hobby: Hobby) => selectedIds.includes(hobby.id))
      );
      const buildingOption = buildingParams.data.find(
        (option: Hobby) => option.name === profileCard.building_name
      );
      const departmentOption = departmentParams.data.find(
        (option: Hobby) => option.name === profileCard.department_name
      );
      const courseOption = courseParams.data.find(
        (option: Hobby) => option.name === profileCard.course_name
      );
      if (buildingOption && departmentOption && courseOption) {
        buildingParams.setOptionId((buildingOption as any).id);
        departmentParams.setOptionId((departmentOption as any).id);
        courseParams.setOptionId((courseOption as any).id);
      }
    }
  }, [allHobbies]);

  let theme = useTheme();

  const validationErrorMessage =
    "Ого, что-то пошло не так с отправкой формы! Проверьте, все ли поля заполнены правильно, и попробуйте снова.";

  const handleSubmitForm = (ev: React.FormEvent<HTMLFormElement>) => {
    // не отправляем данные до валидации
    ev.preventDefault();
    setValidate(true);

    if (
      vkInputProps.value &&
      !vkInputProps.value.startsWith("https://vk.com/")
    ) {
      vkInputProps.setError(true);
    }
    if (tgInputProps.value && !tgInputProps.value.startsWith("https://t.me/")) {
      tgInputProps.setError(true);
    }

    const formIsValid =
      !emailInputProps.error &&
      !passwordInputProps.error &&
      !firstNameInputProps.error &&
      !lastNameInputProps.error &&
      !descriptionInputProps.error &&
      !vkInputProps.error &&
      !(
        vkInputProps.value && !vkInputProps.value.startsWith("https://vk.com/")
      ) &&
      !tgInputProps.error &&
      !(
        tgInputProps.value && !tgInputProps.value.startsWith("https://t.me/")
      ) &&
      (vkInputProps.value !== "" || tgInputProps.value !== "") &&
      courseParams.value !== "" &&
      buildingParams.value !== "" &&
      departmentParams.value !== "" &&
      (isSearchFriend || isSearchLove) &&
      selectedHobbiesIds !== undefined &&
      isBoy != null &&
      String(profileImage) !== "";

    const data = {
      username: emailInputProps.value,
      email: emailInputProps.value,
      password: passwordInputProps.value,
      first_name: firstNameInputProps.value,
      last_name: [lastNameInputProps.value],
      description: descriptionInputProps.value,
      course: courseParams.value,
      building: buildingParams.value,
      department: departmentParams.value,
      is_search_friend: isSearchFriend,
      is_search_love: isSearchLove,
      vk_contact: vkInputProps.value,
      tg_contact: tgInputProps.value,
      hobbies: selectedHobbiesIds,
      is_boy: isBoy,
      image: profileImage,
    };

    const formData = new FormData();
    formData.append("username", emailInputProps.value);
    formData.append("email", emailInputProps.value);
    formData.append("password", passwordInputProps.value);
    formData.append("first_name", firstNameInputProps.value);
    formData.append("last_name", lastNameInputProps.value);
    formData.append("description", descriptionInputProps.value);
    formData.append("course", courseParams.value);
    formData.append("building", buildingParams.value);
    formData.append("department", departmentParams.value);
    formData.append("is_search_friend", isSearchFriend.toString());
    formData.append("is_search_love", isSearchLove.toString());
    formData.append("vk_contact", vkInputProps.value);
    formData.append("tg_contact", tgInputProps.value);
    selectedHobbiesIds?.map((hobbyId) => {
      formData.append("hobbies", hobbyId.toString());
    });
    // formData.append('hobbies', JSON.stringify(selectedHobbiesIds))
    formData.append("is_boy", isBoy!.toString());
    if (profileImage) {
      formData.append("image", profileImage.toString());
    }

    if (formIsValid) {
      setValidationError(false);
      axios
        .put(`${API_URL}/profileData/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          setOpenModal(null);

          snackbar &&
            setSnackbar({
              open: true,
              message: "Данные профиля обновлены!",
              severity: "success",
            });
        })
        .catch((error) => {
          console.error(error);
          setSnackbar({
            open: true,
            message: error.response.data.error || error.response.data.detail,
            severity: "error",
          });
        });
    } else {
      console.error("Form is not valid");
      setValidationError(true);
      setTimeout(() => {
        setValidationError(false);
      }, validationErrorMessage.length / ((150 * 6) / 60 / 1000));
    }
  };

  return (
    <div
      className="wallpaperBackground"
      style={{ flexGrow: 1, display: "grid" }}
    >
      <Portal>
        <Snackbar
          open={snackbar?.open}
          autoHideDuration={6000}
          onClose={snackbarHandleClose}
        >
          <Alert
            onClose={snackbarHandleClose}
            severity={snackbar?.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar?.message}
          </Alert>
        </Snackbar>
      </Portal>
      <Modal
        open={openModal === "edit-profile"}
        onClose={() => setOpenModal(null)}
        style={{ alignSelf: "center", justifySelf: "center" }}
      >
        <Card style={{ outline: "none", padding: 0 }} sx={modalStyle}>
          <form
            onSubmit={handleSubmitForm}
            noValidate
            encType="multipart/form-data"
          >
            {validationError && (
              <Alert
                severity="error"
                style={{
                  width: "inherit",
                  position: "sticky",
                  top: 0,
                  zIndex: 300,
                }}
              >
                {validationErrorMessage}
              </Alert>
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Редактирование профиля
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Для сохранения изменённых данных нажмите на соответствующую
                кнопку снизу.
              </Typography>
              <Box
                sx={{ display: "grid", flexDirection: "column", gap: 1, mt: 1 }}
              >
                <FormLabel
                  component="legend"
                  error={!(profileImage != undefined) && validate}
                >
                  Фотография профиля
                </FormLabel>
                {profileImage && (
                  <Paper
                    variant="outlined"
                    sx={{
                      aspectRatio: 1,
                      backgroundImage: `url(${URL.createObjectURL(
                        profileImage
                      )})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></Paper>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    display: "block",
                    textOverflow: "ellipsis",
                  }}
                >
                  {"Загрузить файл"}
                  <input
                    type="file"
                    name="image_url"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={(ev) => {
                      if (ev.target.files!.length > 0) {
                        let data = ev.target.files![0];
                        setProfileImage(data);
                      }
                    }}
                    hidden
                  />
                </Button>
                <TextField variant="standard" {...firstNameInputProps} />
                <TextField variant="standard" {...lastNameInputProps} />
                <TextField
                  variant="standard"
                  multiline
                  minRows={1}
                  maxRows={5}
                  {...descriptionInputProps}
                />
                <FormControl required error={searchIntentionError && validate}>
                  <FormLabel component="legend">
                    Цель поиска знакомств
                  </FormLabel>
                  <FormGroup
                    style={
                      searchIntentionError && validate
                        ? { color: theme.palette.error.main }
                        : {}
                    }
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={
                            searchIntentionError && validate
                              ? { color: theme.palette.error.main }
                              : {}
                          }
                          checked={isSearchFriend}
                          onChange={(ev) => {
                            setIsSearchFriend(ev.target.checked);
                          }}
                        />
                      }
                      label="Ищу дружбу"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          style={
                            searchIntentionError && validate
                              ? { color: theme.palette.error.main }
                              : {}
                          }
                          checked={isSearchLove}
                          onChange={(ev) => {
                            setIsSearchLove(ev.target.checked);
                          }}
                        />
                      }
                      label="Ищу отношения"
                    />
                  </FormGroup>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ marginBottom: 8 }}
                  required
                  error={isBoy === null && validate}
                >
                  <InputLabel>Ваш пол</InputLabel>
                  <Select
                    value={isBoy ? "male" : "female"}
                    label="Ваш пол"
                    onChange={(ev) => setIsBoy(ev.target.value === "male")}
                  >
                    <MenuItem value="female">Женский</MenuItem>
                    <MenuItem value="male">Мужской</MenuItem>
                  </Select>
                </FormControl>
                <Autocomplete
                  style={{ marginBottom: 8 }}
                  multiple
                  options={allHobbies}
                  getOptionLabel={(option: Hobby) => option.name}
                  defaultValue={preselectedHobbies}
                  // defaultValue={[allHobbies[0]]}
                  renderInput={(params) => {
                    //setHobbies(hobbiesToIds(params.InputProps.startAdornment?.map(el => el.props['label'])))
                    if (!selectedHobbiesIds) {
                      if (params.InputProps.startAdornment instanceof Array) {
                        setSelectedHobbiesIds(
                          hobbiesToIds(
                            params.InputProps.startAdornment.map(
                              (el: any) => el.props["label"]
                            )
                          )
                        );
                      } else if (
                        params.InputProps.startAdornment instanceof Object &&
                        "props" in params.InputProps.startAdornment
                      ) {
                        setSelectedHobbiesIds(
                          hobbiesToIds([
                            params.InputProps.startAdornment.props["label"],
                          ])
                        );
                      }
                    }

                    return (
                      <TextField
                        {...params}
                        label="Хобби"
                        placeholder="Начните печатать..."
                        required
                        error={
                          !(
                            selectedHobbiesIds && selectedHobbiesIds.length > 0
                          ) && validate
                        }
                      />
                    );
                  }}
                />
                {[buildingParams, departmentParams, courseParams].map(
                  (params) => {
                    return <ReactiveSelect {...params} validate={validate} />;
                  }
                )}
              </Box>
              <Typography
                gutterBottom
                variant="subtitle1"
                mt={2}
                color={
                  (validate &&
                    tgInputProps.value === "" &&
                    vkInputProps.value === "") ||
                  tgInputProps.error ||
                  vkInputProps.error
                    ? "error"
                    : ""
                }
              >
                Ссылки на соц. сети для связи
                <FormHelperText
                  error={
                    (validate &&
                      tgInputProps.value === "" &&
                      vkInputProps.value === "" &&
                      true) ||
                    tgInputProps.error ||
                    vkInputProps.error
                  }
                >
                  Необходимо указать ссылку на хотя бы одну соц. сеть
                </FormHelperText>
              </Typography>
              <Box sx={{ display: "grid", flexDirection: "column", gap: 1 }}>
                <TextField
                  variant="standard"
                  {...tgInputProps}
                  error={
                    (validate &&
                      tgInputProps.value === "" &&
                      vkInputProps.value === "" &&
                      true) ||
                    tgInputProps.error ||
                    vkInputProps.error
                  }
                />
                <TextField
                  variant="standard"
                  {...vkInputProps}
                  error={
                    (validate &&
                      tgInputProps.value === "" &&
                      vkInputProps.value === "" &&
                      true) ||
                    tgInputProps.error ||
                    vkInputProps.error
                  }
                />
              </Box>
              <Typography gutterBottom variant="subtitle1" mt={2}>
                Данные для входа
              </Typography>
              <Box sx={{ display: "grid", flexDirection: "column", gap: 1 }}>
                <TextField
                  variant="standard"
                  type="email"
                  {...emailInputProps}
                  required
                />
                <TextField
                  variant="standard"
                  type={showPassword ? "text" : "password"}
                  {...passwordInputProps}
                  required
                  InputProps={{
                    // глазик у поля с паролем
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((prev) => !prev)}
                          //   onMouseDown={() => setShowPassword(prev => !prev)}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </CardContent>
            <CardActions
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Button color="secondary" onClick={() => setOpenModal(null)}>
                Отменить
              </Button>
              <Button color="error" type="submit" formNoValidate>
                Сохранить
              </Button>
            </CardActions>
          </form>
        </Card>
      </Modal>
      {profileCard ? (
        <Box sx={{ justifySelf: "center", alignSelf: "center" }}>
          {cardObjToSwipeCard(profileCard, setOpenModal, true, true)}
        </Box>
      ) : (
        <Alert
          severity="info"
          style={{ alignSelf: "center", justifySelf: "center" }}
        >
          Загрузка...
        </Alert>
      )}
    </div>
  );
}
