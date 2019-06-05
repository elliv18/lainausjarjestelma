export default ({ children }) => (
  <main>
    {children}
    <style jsx global>{`
      * {
        font-family: Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
          'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New',
          monospace, serif;
      }
      html {
        box-sizing: border-box;
        -webkit-font-smoothing: antialised;
        -moz-osx-font-smoothing: grayscale;
      }
      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }
      body {
        margin: 0;
        background-color: rgb(185, 204, 208);
      }
      @media print {
        body {
          background-color: #fff;
        }
      }
    `}</style>
  </main>
);
