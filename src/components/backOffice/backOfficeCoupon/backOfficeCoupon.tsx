import React, {useEffect, useRef, useState} from "react";
import {ICoupon} from "../../../pages/backOffice/backOfficeCodeCouponPage.tsx";
import {FaRegTrashAlt} from "react-icons/fa";

type Props = {
    coupon: ICoupon;
    couponId: string;
    couponName: string;
    couponCode: string;
    discount: string
    inEdit: null | string;
    setInEdit: (inEdit: null | string) => void;
    editCoupons: (codeCoupon: string, action: 'save' | 'delete', payload?: ICoupon) => void;
};

export const BackOfficeCoupon = ({
                                     coupon,
                                     couponId,
                                     couponName,
                                     couponCode,
                                     discount,
                                     inEdit,
                                     editCoupons,
                                     setInEdit
                                 }: Props) => {

    const nameInputRef = useRef<HTMLInputElement>(null);

    const [nameOfCoupon, setNameOfCoupon] = useState<string>(couponName);
    const [codeOfCoupon, setCodeOfCoupon] = useState<string>(couponCode);
    const [discountOfCoupon, setDiscountOfCoupon] = useState<string>(discount);

    // Check all coupon fields to not be empty or 0 in the case of the discount field
    function checkFields(): boolean {
        return nameOfCoupon !== '' && codeOfCoupon !== '' && discountOfCoupon !== '' && discountOfCoupon !== '0';
    }

    // For a new coupon set the focus on coupons name field
    useEffect(() => {
        if (+discountOfCoupon === 0) {
            nameInputRef.current?.focus();
        }
    }, []);

    // Detect any changes in coupon or its values and update the UI
    useEffect(() => {
        if (couponName !== nameOfCoupon) setNameOfCoupon(couponName);
        if (couponCode !== codeOfCoupon) setCodeOfCoupon(couponCode);
        if (discount !== discountOfCoupon) setDiscountOfCoupon(discount);
    }, [coupon, couponName, couponCode, discount]);

    return (
        <li className="coupon-list-item">
            <input
                ref={nameInputRef}
                type="text"
                value={nameOfCoupon}
                readOnly={inEdit !== couponId}
                onChange={(e) => setNameOfCoupon(e.target.value)}
                placeholder="שם הקופון"
            />
            <input
                type="text"
                value={codeOfCoupon}
                readOnly={inEdit !== couponId}
                onChange={(e) => setCodeOfCoupon(e.target.value)}
                placeholder="קוד הקופון"
            />
            <span>
                %<input
                type="text"
                value={discountOfCoupon}
                readOnly={inEdit !== couponId}
                onChange={(e) => setDiscountOfCoupon(e.target.value)}
            />
            </span>

            <div className="coupon-list-item-btn-section">
                {inEdit === couponId ? (
                    <button
                        className="coupon-btn"
                        onClick={() => {

                            if (!checkFields()) return;
                            setInEdit(null);
                            editCoupons(couponId, 'save', {
                                _id: couponId,
                                couponName: nameOfCoupon,
                                couponCode: codeOfCoupon,
                                discount: discountOfCoupon,
                                createdAt: new Date(),
                            })
                        }}>שמור</button>
                ) : (
                    <button className="coupon-btn" onClick={() => setInEdit(couponId)}>ערוך</button>
                )}
                <button
                    className="coupon-btn delete-btn"
                    onClick={() => {
                        editCoupons(couponId, 'delete');
                        setInEdit(null);
                    }
                    }
                >
                    <FaRegTrashAlt/>
                </button>
            </div>
        </li>
    );
};
