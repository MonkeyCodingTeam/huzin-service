declare type RootState = ReturnType<typeof import('@app/store/lib').store.getState>;
declare type AppDispatch = typeof import('@app/store/lib').store.dispatch;
