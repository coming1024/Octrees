
import {Octree} from "./libs/Octree.js";
import {Box3, Vector3} from "./libs/three.module.js";

const camera = new Vector3(10,10,10);//

const demoTree = new Octree();

const point1 = new Vector3(1,1,1);//
const point2 = new Vector3(0,0,0);
const point3 = new Vector3(10,10,10);

demoTree.initiatePosition(camera, 5);
//调试
demoTree.addObject(point1,1);
demoTree.addObject(point2,2);
demoTree.addObject(point3,3);

demoTree.calcBox();
console.log(demoTree.split(0))


