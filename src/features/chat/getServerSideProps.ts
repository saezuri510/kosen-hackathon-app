import { GetServerSideProps } from "next";

import { ChatContents } from "./types/ChatContents";

import { MOCK_API_URL } from "@/constants/mockApiUrl";
import { HttpError, HttpErrorObject } from "@/utils/HttpError";
import { fetcherWithAuth } from "@/utils/fetcherWithAuth";

export type Props = {
  fallback?: {
    [api: string]: ChatContents;
  };
  error?: HttpErrorObject;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const id = ctx.params!.id as string;
  const { error, res } = await fetcherWithAuth(`${MOCK_API_URL}/chats/${id}`, ctx);

  if (error) {
    throw new Error();
  } else if (!res?.ok) {
    return { props: { error: new HttpError(res!).serialize() } };
  }

  const chatContents = (await res?.json()) as ChatContents;

  return {
    props: {
      fallback: {
        [`/chats/${id}`]: chatContents,
      },
    },
  };
};
