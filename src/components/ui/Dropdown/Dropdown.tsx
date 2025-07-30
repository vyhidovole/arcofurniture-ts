
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,

} from "@chakra-ui/menu";
import { Portal, Button } from "@chakra-ui/react";
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
    <Menu>
      <MenuButton
        as={Button}
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
        sx={{
          '&[aria-expanded="true"]': {
            background: 'transparent',
            color: 'black',
            boxShadow: 'none',
          },
          '&[aria-expanded="true"]:hover': {
            background: 'transparent',
            color: 'black',
          },
        }}
      >
        кухни
      </MenuButton>
      <Portal>
        <MenuList bg="white" boxShadow="0 10px 25px rgba(0, 0, 0, 0.3)" borderRadius="6px" p={8}>
          {links.map(({ title, category }, index) => (
            <MenuItem key={`${category}-${index}`}>
              <Link href={`/category/${category}`} style={{ width: "100%", display: "block" }}>
                {title}
              </Link>

            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default Dropdown;
