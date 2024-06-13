import React, { useContext, useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TokenContext, IsDarkColorModified } from '../App';
import createTagRequest from '../api/createTagRequest';
import deleteTagRequest from '../api/deleteTagRequest';
import '../styles/TagDropdown.css' // stylesheet

function TagDropdown({ tags, setTags, selectedTag, setSelectedTag }) {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    // get token
    const { token } = useContext(TokenContext);
    const [tokenVal, setToken] = token;

    const queryClient = useQueryClient(); // for invalidating queries

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && (isOpen || isAddingTag)) {
                setIsAddingTag(false); // Close form
                setSelectedTag({ name: null, color: null }); // Close dropdown (optional)
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isAddingTag]); // Empty dependency array ensures this runs only once on mount

    const toggleDropdown = () => {
        if (isAddingTag) {
            setIsAddingTag(false);
        } else {
            setIsOpen(!isOpen);
        }
    }

    const handleTagSelect = (tag) => {
        if (tag === 'addTag') {
            setIsAddingTag(true);
        } else {
            setSelectedTag(tag);
        }
        setIsOpen(false); // Close dropdown after selection

    };

    const handleCancelTag = () => {
        setIsAddingTag(false);
        setNewTagName(''); // Clear the input field
        setNewTagColor('');
    };


    // API call to create tag selected
    // invalidates local cache after compeletion
    const handleTagCreate = useMutation({
        mutationFn: () => {
            // if (newTagName.trim() !== '') {
            const newTag = { name: newTagName, color: newTagColor };
            setSelectedTag(newTag);
            setNewTagName('');
            setNewTagColor('');
            setIsAddingTag(false);

            return createTagRequest(newTag, tokenVal);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
        },
    });

    // call API to delete tag & invalidate local cache
    const handleTagDelete = useMutation({
        mutationFn: (tag) => {
            if (tag == selectedTag) {
                setSelectedTag({ name: null, color: null }); // Deselect the deleted tag
            }
            return deleteTagRequest(tag, tokenVal)
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['tags'], refetchType: 'all'});
        },
    });


    const colorOptions = [
        "#188526", "#4DFF4D", "#4DFFB2", "#31E0E0", "#507275",
        "#3163E0", "#A020F0", "#E031E0", "#FF4DA6", "#C70039",
        "#EB4034", "#F39C12", "#EDD70E", "#7D3B23", "#FFFFFF",
    ];

    const dropdownRef = useRef(null);

    // dynamically color tag
    const getColor = (backgroundColor) => {
        return IsDarkColorModified(backgroundColor) ? '#e8e8e8' : '#28292a';
    }

    // dynamically color tag; handle null input
    const getColorNull = (backgroundColor) => {

        return backgroundColor ? getColor(backgroundColor) : ''
    }

    return (
        <div className="tag-dropdown" ref={dropdownRef}>
            <div className="dropdown-header"
                onClick={toggleDropdown}
                style={{ 
                    backgroundColor: selectedTag.name  ? selectedTag.color : '#28292a', 
                    color: getColorNull(selectedTag.color)}}>
                {selectedTag.name ? selectedTag.name : 'Select Tag'}
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    {tags.map(tag => (
                        <li 
                            key={tag.name} 
                            className="dropdown-item" 
                            onClick={() => handleTagSelect(tag)} 
                            style={{ backgroundColor: tag.color, color: getColor(tag.color) }}
                        >
                            <p className="dropdown-text">{tag.name}</p>
                            <button className="delete-button" onClick={(e) => {e.stopPropagation(); handleTagDelete.mutate(tag)}}>
                                <p className="dropdown-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M5.47 5.47a.75.75 0 0 1 1.06 0l12 12a.75.75 0 1 1-1.06 1.06l-12-12a.75.75 0 0 1 0-1.06" /><path d="M18.53 5.47a.75.75 0 0 1 0 1.06l-12 12a.75.75 0 0 1-1.06-1.06l12-12a.75.75 0 0 1 1.06 0" /></g> </svg>
                                </p>
                            </button>
                        </li>
                    ))}
                    <li className={'dropdown-item active'} onClick={() => handleTagSelect('addTag')}>
                        + Add Tag
                    </li>
                </ul>
            )}
            {isAddingTag && (
                <div className="add-tag-form" style={{
                    top: dropdownRef.current?.offsetHeight + 'px', // Position below the dropdown
                    position: 'absolute',
                    left: 0,
                }}>
                    <input
                        type="text"
                        className="add-tag-input"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Enter tag name..."
                        maxLength={10}
                        style={{
                            backgroundColor: newTagColor ? newTagColor : '',
                            color: getColorNull(newTagColor)
                        }}
                    />
                    <div className="color-options-grid">
                        {colorOptions.map(color => (
                            <button
                                key={color}
                                className={`color-circle ${color === newTagColor ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setNewTagColor(color)}
                            ></button>
                        ))}
                    </div>
                    <div className="form-buttons">
                        <button className="left" onClick={handleCancelTag}>CANCEL</button>
                        <button
                            className="right"
                            onClick={
                                (newTagName.trim() !== '')
                                    ? () => handleTagCreate.mutate()
                                    : () => { }
                            }
                        >CREATE</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TagDropdown;
