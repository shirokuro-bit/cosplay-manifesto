import {Button, Link} from "@mui/material";

const baseLink = "https://twitter.com/intent/tweet";

type TweetLinkType = {
  text?: string
  tweetText?: string,
  url?:string,
  hashtags?:string[]
}

export const TweetLink = ({text, url, hashtags}:TweetLinkType) => {
  const link = (text?: string, url?:string, hashtags?:string[]) => {
    return `${baseLink}?text=${text}&url=${url}&hashtags=${hashtags?.join(",")}`;
  };
  
  const tweetText = () => {
    if (hashtags) {
      return  `${hashtags?.map(value => `#${value}`).join(" ")}で`;
    } else {
      return  "";
    }
  };
  
  return (
    <Button variant={"outlined"}>
      <Link href={link(text, url, hashtags)} underline="none">
        {tweetText()}ツイート
      </Link>
    </Button>
);
};
