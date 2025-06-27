import React, {useEffect, useRef, useState} from "react";
import {ICoupon} from "../../../pages/backOffice/backOfficeCodeCouponPage.tsx";
import {FaRegTrashAlt} from "react-icons/fa";
import {useGeneralStateContext} from "../../../context/generalStateContext.tsx";

type Props = {
    coupon: ICoupon;
    couponId: string;
    couponName: string;
    couponCode: string;
    discount: string
    inEdit: null | string;
    setInEdit: (inEdit: null | string) => void;
    editCoupons: (codeCoupon: string, action: 'save' | 'delete', payload: ICoupon) => void;
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

    const generalContext = useGeneralStateContext();
    const isTranslated = generalContext.language !== 'he';

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
            <div className={isTranslated ? "coupon-list-item-wrapper translated" : "coupon-list-item-wrapper"}>
                <label>
                    <p className={isTranslated ? "coupon-list-item-title translated" : "coupon-list-item-title"}>{generalContext.t('backOfficeCoupons.couponName')}</p>
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={nameOfCoupon}
                        readOnly={inEdit !== couponId}
                        onChange={(e) => setNameOfCoupon(e.target.value)}
                        placeholder={generalContext.t('backOfficeCoupons.couponName')}
                    />
                </label>
                <label>
                    <p className={isTranslated ? "coupon-list-item-title translated" : "coupon-list-item-title"}>{generalContext.t('backOfficeCoupons.couponCode')}</p>
                    <input
                        type="text"
                        value={codeOfCoupon}
                        readOnly={inEdit !== couponId}
                        onChange={(e) => setCodeOfCoupon(e.target.value)}
                        placeholder={generalContext.t('backOfficeCoupons.couponCode')}
                    />
                </label>
                <label>
                    <p className={isTranslated ? "coupon-list-item-title translated" : "coupon-list-item-title "}>{generalContext.t('backOfficeCoupons.discount')}</p>
                    <input
                        type="text"
                        value={discountOfCoupon}
                        readOnly={inEdit !== couponId}
                        onChange={(e) => setDiscountOfCoupon(e.target.value)}
                    />
                </label>

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
                                    createdAt: coupon.createdAt || new Date(),
                                })
                            }}>{generalContext.t('shared.save')}</button>
                    ) : (
                        <button className="coupon-btn"
                                onClick={() => setInEdit(couponId)}>{generalContext.t('shared.edit')}</button>
                    )}
                    <button
                        className="coupon-btn delete-btn"
                        onClick={() => {
                            editCoupons(couponId, 'delete', {
                                _id: couponId,
                                couponName: nameOfCoupon,
                                couponCode: codeOfCoupon,
                                discount: discountOfCoupon,
                                createdAt: coupon.createdAt || new Date(),
                            });
                            setInEdit(null);
                        }
                        }
                    >
                        <FaRegTrashAlt/>
                    </button>
                </div>
            </div>
        </li>
    );
};
