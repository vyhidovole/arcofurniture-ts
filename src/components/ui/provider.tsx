"use client";

import React from 'react'; // Импортируйте React
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider} from "./color-mode"; // Убедитесь, что ColorModeProvider правильно импортирован

export function Provider(props: object) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
