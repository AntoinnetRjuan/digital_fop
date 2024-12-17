import Items from "./Items.jsx"
import {PRODUCTS,RESOURCES,COMPANY,SUPPORT} from "./MenuFooter.jsx"



const ItemsContener = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 ">
    <Items  Links={PRODUCTS} title="COURS DE JUSTICE"/>
    <Items Links={RESOURCES} title="ORGANES LEGISLATIFS"/>
    <Items Links={SUPPORT} title="CONTACTS"/>
    <Items Links={COMPANY} title="MILIEU ACADEMIQUE"/>
    </div>
  )

}

export default ItemsContener
