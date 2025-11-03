const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>TRPC demo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="description" content="TRPC demo" />
        <meta content="text/html; charset=UTF-8" name="Content-Type" />
        <meta content="#020E1B" name="theme-color" />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
