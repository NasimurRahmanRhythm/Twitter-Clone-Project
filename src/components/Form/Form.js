import useLoginModal from '@/src/hooks/useLoginModal';
import usePosts from '@/src/hooks/usePosts';
import useRegisterModal from '@/src/hooks/useRegisterModal'
import axios from 'axios';
import React, { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast';
import Avatar from '../Avatar/Avatar';
import usePost from '@/src/hooks/usePost';
import styles from './Form.module.css';
import useCurrentUser from '@/src/hooks/useCurrentUser';
import Button from '../Button/Button';
import ImageUpload from '../ImageUpload/ImageUpload';

const Form = ({placeholder, isComment, postId}) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const { data: currentUser} = useCurrentUser();
    const { mutate: mutatePosts } = usePosts();
    const { mutate: mutatePost } = usePost(postId);
    console.log("isComment is ",isComment);
    const [body, setBody] = useState('');
    const [image, setImage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState(isComment ? 'comment' : 'post');
    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append('body', body);
            if (isComment === true) {
                await axios.post('/api/posts', {
                  body,
                  image,
                  postId,
                  type: type,
                });
              
              // mutatePost((currentPost) => ({
              //   ...currentPost,
              //   comments: [...(currentPost.comments || []), response.data._id]
              // }));
              
            }
            else {
              await axios.post('/api/posts', {
                body,
                image,
                type: type,
              })
            }
            // else{
            //     await axios.post('/api/posts', {
            //     body,
            //     type: type,
            //   });
            // }

            // const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';
            // await axios.post(url, formData);

            toast.success('Tweet Created');
            setBody('');
            setImage(undefined);
            mutatePosts();
            mutatePost();
        } catch (error) {
            toast.error("Something in Form is wrong");
        }finally {
            setIsLoading(false);
        }
    },[body, image, mutatePosts, mutatePost, isComment, postId,type]);
    return (
        <div className={styles.formContainer}>
          {currentUser ? (
            <div className={styles.userForm}>
              <div>
                <Avatar userId={currentUser?.id} />
              </div>
              <div className={styles.textareaWrapper}>
                <textarea
                  disabled={isLoading}
                  onChange={(e) => setBody(e.target.value)}
                  value={body}
                  className={`${styles.textarea} ${
                    isLoading ? styles.disabledOpacity : ''
                  }`}
                  placeholder={placeholder}
                ></textarea>
                <ImageUpload
                    onChange={(image) => setImage(image)}
                    label="Upload an image"
                />
                <hr
                  className={`${styles.hr} ${
                    isLoading ? styles.peerFocusOpacity : ''
                  }`}
                />
                <div className={styles.buttonWrapper}>
                  <Button
                    disabled={isLoading || !body}
                    onClick={onSubmit}
                    label="Tweet"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.welcomeContainer}>
              <h1 className={styles.welcomeTitle}>Welcome here</h1>
              <div className={styles.buttonGroup}>
                <Button label="Login" onClick={loginModal.onOpen} />
                <Button label="Register" onClick={registerModal.onOpen} secondary />
              </div>
            </div>
          )}
        </div>
      );
}

export default Form;
