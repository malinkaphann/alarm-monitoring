const Layout = ({ children }) => {
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        // set this to `minHeight: '100vh'` for full viewport height
        minHeight: '100vh',
      }}
    >
      <header
        sx={{
          width: "100%",
        }}
      >
        {/*Header*/}
      </header>
      <main
        sx={{
          width: "100%",
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {children}
      </main>
      <footer
        sx={{
          width: "100%",
        }}
      >
        {/*Footer*/}
      </footer>
    </div>
  );
};

export default Layout;
