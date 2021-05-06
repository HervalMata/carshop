import { changeScreenA, changeScreenB, changeScreenC } from "../../store/actions/navigation.action";
import { useDispatch, useSelector } from "react-redux";
import { Drawer } from "@material-ui/core";

const style = {
    width: '680px',
    maxWidth: window.innerWidth
}

export default function Navigation() {

    const dispatch = useDispatch();
    const nav = useSelector(state => state.navigationReducer)

    return (
        <>
            <Drawer
                anchor="right"
                open={nav.screenA.open}
                onClose={() => dispatch(changeScreenA({ open: false }))}
            >
                <div style={style}></div>
            </Drawer>
            <Drawer
                anchor="right"
                open={nav.screenB.open}
                onClose={() => dispatch(changeScreenB({ open: false }))}
            >
                <div style={style}></div>
            </Drawer>
            <Drawer
                anchor="right"
                open={nav.screenC.open}
                onClose={() => dispatch(changeScreenC({ open: false }))}
            >
                <div style={style}></div>
            </Drawer>
        </>
    )
}
