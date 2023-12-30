

import { NextPage, GetServerSideProps } from "next";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import { useEffect, useState } from "react";
import styles from "./index.module.css";



type Props = { initialImageUrl: string; };

const IndexPage : NextPage<Props> = ({ initialImageUrl }) => {
	const [imageUrl, setImageUrl] = useState(initialImageUrl);
	const [loading, setLoading] = useState(true);

	// useEffectには非同期関数は直接渡せない
	useEffect(() => {
		fetchImage().then((img) => {
			setImageUrl(img.url);
			setLoading(false);
		});
	}, []);
	
	const handleClick = async () => {
		setLoading(true);
		const newImage = await fetchImage();
		setImageUrl(newImage.url);
		setLoading(false);
	};
	return <><div><button onClick={handleClick}>see others</button></div><div>{loading || <img src={imageUrl} />}</div></>;
};
export default IndexPage;


type Image = {
	url : string;
};

const isImage = (value : unknown) : value is Image => { // type predicate value is Image
	if(!value || typeof value !== "object") {
		return false;
	}
	return "url" in value && typeof value.url === "string";
};

// will be executed on server-side.
export const getServerSideProps : GetServerSideProps<Props> = async() => { // export is required so that next can recognize
	const img = await fetchImage();
	return {
		props: {
			initialImageUrl: img.url,
		},
	};
};

const fetchImage = async () : Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  console.log(images);
  return images[0];
};