import { Button, Menu, Portal } from "@chakra-ui/react";
import Link from "next/link";

const links = [
  { title: "Угловые кухни", category: "kitchen" },
  { title: "Модульные кухни", category: "kitchen" },
  { title: "Готовые комплекты", category: "kitchen" },
  { title: "Маленькие кухни", category: "kitchen" },
  { title: "Кухонные уголки", category: "kitchen" },

];

const Dropdown = () => {
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
         кухни
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content p="16px" display="flex" flexDirection="column">
            {links.map(({ title, category }, index) => (
              <Menu.Item key={`/category${category}-${index}`} asChild value={title}>
                <Link href={`/category/${category}`} style={{ width: "100%", display: "block" }}>
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

export default Dropdown;
