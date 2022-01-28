import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "./hooks/useSpotify";
const colors = [
  "from-red-300", // R
  "from-orange-300", // O
  "from-yellow-300", // Y
  "from-green-300", // G
  "from-blue-300", // B
  "from-indigo-300", // I
  "from-violet-300", // V
]

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState); 
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId)
    .then((data) => {
      setPlaylist(data.body);
    }).catch((err) => console.log("something went wrong fetching playlists"))
  }, [spotifyApi, playlistId])

  console.log("fFffasadas",playlist)

  return (
  <div className="flex-grow text-white">
    <header className="absolute top5 right-8">
      <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
        <img className="rounded-full w-10 h-10" src={session?.user.image} alt="" />
        <h2>{session?.user.name}</h2>
        <ChevronDownIcon className="h5 w-5" />
      </div>
    </header>

    <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}>
      <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=""></img>
      <div>
        <p>PLAYLIST</p>
        <h2 className="text-2xl md:text-3xl xl:text-5xl font-bold"></h2>
      </div>
    </section>
    <div>
      <Songs />
    </div>
  </div>
  );
}

export default Center;
