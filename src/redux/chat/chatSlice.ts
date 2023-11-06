import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import {
  fetchPastEventsBuilder,
  likelyCauseBuilder,
  postChatQueryBuilder,
  postNewChatEventBuilder,
} from "redux/thunks/chat";
import { CHAT_EVENTS } from "utils/gpt/constants";

import { type RootState } from "../store";
import {
  type ChatEventInferenceType,
  type ChatEventQueryType,
  type ChatReduxType,
} from "./chatTypes";

const initialState: ChatReduxType = {
  queries: [],
  history: [],
  loading: false,
  likelyCause: {
    loading: false,
    typing: false,
    error: false,
    event: null,
    id: nanoid(),
  },
  contextIncident: null,
  historyCount: null,
  //   eventLoading: false,
  //   chatLoading: false,
  //   historyLoading: false,
  //   pastEventCount: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addTagCard: (state, { payload }: { payload: string }) => {
      state.queries.push({
        id: nanoid(),
        event: {
          type: CHAT_EVENTS.TAG,
          tag: payload,
        },
      });
    },
    stopLikelyCauseTyping: (state) => {
      state.likelyCause.typing = false;
    },
    stopTyping: (state, { payload }: { payload: string }) => {
      if (payload === state.likelyCause.id) {
        state.likelyCause.typing = false;
        return;
      }
      const queryIndex = state.queries.findIndex((q) => q.id === payload);
      const query = state.queries[queryIndex] as
        | ChatEventQueryType
        | ChatEventInferenceType;
      if (query) {
        query.typing = false;
        state.queries[queryIndex] = query;
      }
    },
    resetChat: (state) => {
      return initialState;
    },
  },

  //   ASYNC THUNKS
  extraReducers: (builder) => {
    likelyCauseBuilder(builder);
    postNewChatEventBuilder(builder);
    postChatQueryBuilder(builder);
    fetchPastEventsBuilder(builder);
  },
});

// Action creators are generated for each case reducer function

export const { stopLikelyCauseTyping, stopTyping, resetChat, addTagCard } =
  chatSlice.actions;

export const chatSelector = (state: RootState): ChatReduxType => state.chat;

export default chatSlice.reducer;
