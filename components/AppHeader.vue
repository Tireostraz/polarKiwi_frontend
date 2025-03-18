<template>
  <Container>
    <Navbar expand="lg" background-color="body-tertiary">
      <Container type="fluid text-center">
        <NavbarBrand to="/">
          <b-img
            src="logo.png"
            width="30"
            height="30"
            vertical-align="text-top"
            display="inline-block"
          />
        </NavbarBrand>
        <NavbarToggler />
        <NavbarCollapse>
          <NavbarNavList margin="e-auto b-2 b-lg-0">
            <NavItem>
              <NavLink active aria-current="page">
                <b-img
                  src="polarKiwiText.svg"
                  width="100"
                  height="30"
                  vertical-align="text-top"
                  display="inline-block"
                />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled aria-current="page"> Disabled </NavLink>
            </NavItem>
          </NavbarNavList>
        </NavbarCollapse>
        <NavbarNavList>
          <NavItem>
            Войти
            <b-img
              src="Login.svg"
              width="20"
              height="20"
              vertical-align="text-top"
              display="inline-block"
            />
          </NavItem>
        </NavbarNavList>
      </Container>
    </Navbar>
  </Container>
</template>
