import { Button, Menu, Portal } from "@chakra-ui/react"

const  DropdownLiving = () => {
 return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button size="sm"
          variant="ghost"
          fontSize="lg"
          _focus={{
            boxShadow:"none",
            bg:"transparent",
            color:"black"
          }}
          _focusVisible={{
            boxShadow:"none",
            bg:"transparent",
            color:"black"
          }}
          _active={{
            bg:"transparent",
            color:"black"
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
           гостиные
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content p="16px">
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
  )
}

const links = [
  {
    title: " Модульные",
    href: "/drawing-room",
  },
  {
    title: "Готовые комплекты",
    href: "/drawing-room",
  },
  {
    title: "Маленькие",
    href: "/drawing-room",
  },
]
export default DropdownLiving