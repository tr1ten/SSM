import { FormEventHandler, useEffect, useRef, useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
type PProps = {
  authorId: string | undefined;
};
const PostContainer = ({ authorId }: PProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [isDisable, setisDisable] = useState(true);
  useEffect(() => {
    if (authorId) {
      setisDisable(false);
    }
  }, [authorId]);

  const submitPost: FormEventHandler = async (e) => {
    console.log("submitting post");
    setisDisable(true);
    e.preventDefault();
    const title = titleRef.current?.value;
    const body = bodyRef.current?.value;
    if (!title || !body || !authorId) {
      console.log("not valid details", title, body, authorId);
      return;
    }
    const jwt = localStorage.getItem("jwt");
    const reqBody = {
      title,
      body,
      authorId,
    };
    try {
      const res = await fetch("http://localhost:3001/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(reqBody),
      });
      window.location.reload();
    } catch (err) {
      console.log("error while posting ", err);
    }
    setisDisable(false);
  };

  return (
    <form onSubmit={submitPost}>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">title</InputGroup.Text>
        <FormControl
          ref={titleRef}
          placeholder="title"
          aria-label="title"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>Body</InputGroup.Text>
        <FormControl ref={bodyRef} as="textarea" aria-label="With textarea" />
      </InputGroup>
      <Button type="submit" disabled={isDisable} variant="success">
        Post
      </Button>
    </form>
  );
};

export default PostContainer;
