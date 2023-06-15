import styles from "./EditProfile.module.css";
import tweeterLogo from "../../../../../public/Twitter-logo.png";
import Image from "next/image";
import { Input } from "@/participated/components/input/Input";
import { useForm } from "react-hook-form";
import { FileInput } from "@/participated/components/file-reader/FileReader";
import { Avator } from "../avatar/Avatar";
import { useState } from "react";
import { useLoading } from "@/participated/hooks/useLoading";
import { LoadingBar } from "@/participated/components/loading-bar/LoadingBar";
import { getDateFormatString } from "@/participated/libs/getDateString";
import { useToast } from "@/participated/hooks/useToast";
import { UserActions } from "../../actions/user.action";
export function EditProfile({ user, onComplete = () => {}, dispatch }) {
  const dateOfBirth = user.dateOfBirth && getDateFormatString(user.dateOfBirth);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      dateOfBirth: dateOfBirth || " ",
    },
  });
  const createToast = useToast();
  const loading = useLoading();
  const [profile, setProfile] = useState(user?.image);
  const [cover, setCover] = useState(user?.cover);
  const onSubmit = async (data) => {
    loading.start();
    await dispatch(UserActions.UPDATE, {
      ...data,
      profile: profile?.file,
      cover: cover?.file,
    });
    loading.complete();
  };

  return (
    <div className={styles.editCard}>
      <LoadingBar loading={loading.loading} />
      <Image src={tweeterLogo} alt="tweeter" className={styles.tweeterLogo} />
      <h4>Edit Your Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FileInput
          id="cover"
          className={styles.cover}
          onSelect={(e) => {
            setCover(e);
          }}
        >
          <img src={cover?.src ? cover.src : cover} alt="cover" />
        </FileInput>

        <FileInput
          id="profile"
          className={styles.profile}
          onSelect={(e) => {
            setProfile(e);
          }}
        >
          <div>
            <Avator src={profile?.src ? profile.src : profile} size={70} />
          </div>
        </FileInput>

        <Input
          register={register("name", {
            minLength: 3,
            required: "name is required",
          })}
          placeHolder="name"
        />

        <Input
          register={register("email", { required: "email is required" })}
          placeHolder="email"
        />

        <Input
          register={register("dateOfBirth", {
            required: "date of birth is required",
          })}
          placeHolder="date of birth"
          type="date"
        />

        <button
          disabled={!isValid}
          className={`btn  ${isValid ? "btn-primary" : "btn-disabled"}`}
          type="submit"
        >
          save
        </button>
      </form>
    </div>
  );
}
