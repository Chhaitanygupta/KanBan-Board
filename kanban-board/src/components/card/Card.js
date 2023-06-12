import React, { useState } from 'react'
import './Card.css'
import Chip from "../chips/Chip"
import Dropdown from "../dropdown/Dropdown";
import { MoreHorizontal } from 'react-feather'
import CardInfo from "./CardInfo/CardInfo";
function Card(props) {
    const [showDropdown, setShowDropdown] = useState(true);
    const [showModal, setShowModal] = useState(true);
    return (
        <>
        {showModal && (<CardInfo card={props.card} onClose={() => setShowModal(false)} />)}
            {showModal && <CardInfo card={props.card} 
            updateCard={props.updateCard}
            boardId={props.boardId}
            onClose={() => setShowModal(false)} />}
            <div className="card" draggable
                onDragEnd={() => props.handleDragEnd(props.card?.id, props.boardId)}
                onDragEnter={() => props.handleDragEnter(props.card?.id, props.boardId)}
                onClick={() => setShowModal(true)}>
                <div className="card_top">
                    <div className="card_top_labels">
                        {
                            props.card?.labels?.map((item, index) => (
                                <Chip key={index} text={item.text} color={item.color} />
                            ))
                        }
                    </div>
                    <div className="card_top_more" onClick={() => setShowDropdown(true)}>
                        <MoreHorizontal />
                        { showDropdown && (
                                <Dropdown className="card_dropdown"onClose={() => setShowDropdown(false)}>
                                    <div className="card_dropdown">
                                        <p onClick={() => props.removeCard(props.card?.id, props.boardId)}>Delete Card</p>
                                    </div>
                                </Dropdown>
                            )}
                    </div>
                </div>
                <div className="card_title">{props.card?.title}</div>
                <div className="card_footer">
                    <p className="card_footer_item">
                        Description
                    </p>
                </div>
            </div>
        </>
    );
}
export default Card;
