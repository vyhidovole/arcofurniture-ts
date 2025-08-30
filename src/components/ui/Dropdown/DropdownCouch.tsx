import React from "react";
import { Button, Menu, Portal } from "@chakra-ui/react";
import Link from "next/link";

const links = [
  { title: "Прямые", category: "couch" },
  { title: "На металлокаркасе", category: "couch" },
  { title: "Кресла", category: "couch" },
 
];

const DropdownCouch = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="outline"
          color="black"
          borderColor="#14b8a6"
          fontSize="lg"
          _focus={{
            outline: "none",
            boxShadow: "none",
            bg: "transparent",
            color: "black",
          }}
          _focusVisible={{
            outline: "none",
            boxShadow: "none",
            bg: "transparent",
            color: "black",
          }}
          _active={{
            bg: "transparent",
            color: "black",
          }}
          _hover={{
            bg: "#14b8a6",
            color: "white",
          }}
          css={{
            '&[aria-expanded="true"]': {
              background: 'transparent !important',
              color: 'black !important',
              boxShadow: 'none !important',
            },
            '&[aria-expanded="true"]:hover': {
              background: 'transparent !important',
              color: 'black !important',
            },
          }}
        >
         диваны
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content p="16px"display="flex" flexDirection="column">
           {links.map(({ title, category }, index) => (
              <Menu.Item key={`${category}-${index}`} asChild value={title}>
                <Link href={`/category/${category}`} >
                  {title}
                </Link>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default  DropdownCouch;