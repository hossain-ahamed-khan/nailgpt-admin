"use client"
import { Provider } from "react-redux"
import { persistor, store } from "@/redux/store"
import React from "react"
import { PersistGate } from "redux-persist/lib/integration/react"

type Props = {
    children: React.ReactNode
}

export default function Providers({ children }: Props) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}