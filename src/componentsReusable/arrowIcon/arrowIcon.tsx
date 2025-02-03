import React from "react";
import {MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight} from "react-icons/md";
import {useGeneralStateContext} from "../../context/generalStateContext.tsx";

interface IArrowIcon {
    arrowDirection: 'L' | 'R';
}

const ArrowIcon: React.FC<IArrowIcon> = ({arrowDirection}) => {

    const generalContext = useGeneralStateContext();

    if (arrowDirection === 'R') {
        return (
            <>
                {
                    generalContext.language === 'he' ?
                        <MdKeyboardDoubleArrowRight/>
                        :
                        <MdKeyboardDoubleArrowLeft/>
                }
            </>
        );
    } else {
        return (
            <>
                {
                    generalContext.language === 'he' ?
                        <MdKeyboardDoubleArrowLeft/>
                        :
                        <MdKeyboardDoubleArrowRight/>
                }
            </>
        );
    }
};

export default ArrowIcon;
