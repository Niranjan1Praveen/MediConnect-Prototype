import GLBModelViewer from "@/components/dashboard/GLBModelViewer";
import React from "react";

function HeroGLB(props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <GLBModelViewer url="/assets/models/assistant.glb" height={200} />
    </div>
  );
}

export default HeroGLB;
