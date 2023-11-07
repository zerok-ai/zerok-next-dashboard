import {
  type ActionReducerMapBuilder,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { type ChatEventType, type ChatReduxType } from "redux/chat/chatTypes";
import { type RootState } from "redux/store";
import { CHAT_EVENTS } from "utils/gpt/constants";
import { GPT_HISTORY_ENDPOINT } from "utils/gpt/endpoints";
import raxios from "utils/raxios";

export const fetchPastEvents = createAsyncThunk(
  "chat/fetchPastEvents",
  async (
    values: { issueId: string; selectedCluster: string },
    { getState }
  ) => {
    const { issueId, selectedCluster } = values;
    const state: RootState = getState() as RootState;
    const endpoint = GPT_HISTORY_ENDPOINT.replace(
      "{cluster_id}",
      selectedCluster
    )
      .replace("{issue_hash}", issueId)
      .replace("{offset}", state.chat.history.length.toString());
    const rdata = await raxios.get(endpoint);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      historyCount: rdata.data.payload.total_count,
      events: rdata.data.payload.events,
    } as {
      historyCount: number;
      events: ChatEventType[];
    };
  }
);

export const fetchPastEventsBuilder = (
  builder: ActionReducerMapBuilder<ChatReduxType>
) => {
  builder
    .addCase(fetchPastEvents.pending, (state) => {
      state.loading = CHAT_EVENTS.HISTORY;
    })
    .addCase(fetchPastEvents.fulfilled, (state, { payload }) => {
      const queries = payload.events.map((e) => {
        return {
          ...e,
          id: nanoid(),
          typing: false,
        };
      });
      state.queries = [...queries, ...state.queries];
      state.historyCount = payload.historyCount;
      state.history = payload.events;
      state.loading = false;
    });
};
