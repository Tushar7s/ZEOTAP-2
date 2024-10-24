# parcel
- Dev Build
- Local Server
- HMR = Hot Module Replacement
- File Watching Algorithm - written in c++
- Faster Builds - Because of Caching 
// React Element
//jsx(transpiled it reaches the JS) -> parcel (with the help of babel)
// const jsxHeading = <h1 className="head">Nmaste React using jsx</h1> 

//React Functional Component
// const Title = () => (
//   <h1 className="head">
//     Namaste React using jsx
//   </h1>
// );
// const elem = <span>React Element</span>
//  const title = (
//     <h1 className="head">
//       {elem} 
//       Namaste React using jsx
//     </h1>
//  );
//  const HeadingComponent = () => (
//    <div id="container">
//     <Title />
//    <h1 className="heading">Namaste react functional component</h1>
//    </div>
//  );
//  const HeadingComponent = () => (
//   <div id="container">
//     {/* react element inside a component */}
//    {title} 
//   <h1 className="heading">Namaste react functional component</h1>
//   </div>
// );
/**
 * Header --> logo, nav-items, 
 * Body --> search, restaurantContainer(cards)
 * Footer --> copyright, links, address, contact
 */

 TWO TYPES OF EXPORT/IMPORT

 export default component;
 import component from "path"

 export const component;
 import {component} from "path"\

 Normal JS functions 
 -- useState() - To generate super powerful react variables   
 -- useEffect()