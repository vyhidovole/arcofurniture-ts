import { Button, Menu, Portal } from "@chakra-ui/react";

const links = [
  { title: "Угловые кухни", href: "/kitchen" },
  { title: "Модульные кухни", href: "/kitchen" },
  { title: "Готовые комплекты", href: "/kitchen" },
  { title: "Маленькие кухни", href: "/kitchen" },
  { title: "Кухонные уголки", href: "/kitchen" },
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
            // Когда меню открыто — перекрываем стили фокуса и ховера
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
          <Menu.Content p='16px'>
            {links.map((link) => (
              <Menu.Item key={link.href} asChild value={link.title}>
                <a href={link.href}  rel="noreferrer">
                  {link.title}
                </a>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default Dropdown;
