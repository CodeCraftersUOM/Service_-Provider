import Login from "./components/login";
import Middle from "./components/Middle";

export default function Home() {
  return (
    <main
      style={{
        backgroundImage: "url('/propic.png')", // Path to image in public folder
        backgroundSize: "cover", // Ensures it covers the full page
        backgroundPosition: "center", // Centers the image
        height: "100vh", // Full height of viewport
        width: "100vw", // Full width of viewport
        display: "flex", // Allows content positioning
        flexDirection: "column", // Stacks children vertically
        alignItems: "center", // Centers horizontally
        justifyContent: "center", // Centers vertically
      }}
    >
      <Middle />
      <Login />
    </main>
  );
}
