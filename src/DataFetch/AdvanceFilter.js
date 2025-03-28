import React, { useState, useRef, useEffect } from 'react';
import { Select, Option, Card, Button } from '@citi-icg-172888/icgds-react';

export default function CustomizeFilter() {
  // State to store selected values for each filter
  const [filters, setFilters] = useState({
    sprint: '',
    domain: '',
    tpm: '',
    issueType: '',
    capability: '',
    productOwner: '',
  });

  // Ref for the card header
  const cardHeaderRef = useRef();

  // Handle change for each filter
  const onChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    console.log(`Selected ${filterName}: ${value}`);
  };

  // Handle Apply button click
  const handleApply = () => {
    // Log the selected filters (you can replace this with your own function)
    console.log('Applied Filters:', filters);

    // Example: Invoke a function to handle the applied filters
    applyFilters(filters);
  };

  // Function to handle applied filters (replace with your actual logic)
  const applyFilters = (filterValues) => {
    // This is a placeholder function; replace it with your actual logic
    console.log('Invoking applyFilters with values:', filterValues);
    // Example: You might pass these values to a parent component, make an API call, etc.
  };

  // Handle Cancel button click (reset selections)
  const handleCancel = () => {
    setFilters({
      sprint: '',
      domain: '',
      tpm: '',
      issueType: '',
      capability: '',
      productOwner: '',
    });
    console.log('Filters reset');
  };

  // Sample data for dropdowns (you can replace these with actual data)
  const sprintOptions = [
    { title: 'Sprint 1', label: 'Sprint 1', value: 'sprint1' },
    { title: 'Sprint 2', label: 'Sprint 2', value: 'sprint2' },
    { title: 'Sprint 3', label: 'Sprint 3', value: 'sprint3' },
  ];

  const domainOptions = [
    { title: 'Domain A', label: 'Domain A', value: 'domainA' },
    { title: 'Domain B', label: 'Domain B', value: 'domainB' },
    { title: 'Domain C', label: 'Domain C', value: 'domainC' },
  ];

  const tpmOptions = [
    { title: 'TPM 1', label: 'TPM 1', value: 'tpm1' },
    { title: 'TPM 2', label: 'TPM 2', value: 'tpm2' },
    { title: 'TPM 3', label: 'TPM 3', value: 'tpm3' },
  ];

  const issueTypeOptions = [
    { title: 'Bug', label: 'Bug', value: 'bug' },
    { title: 'Feature', label: 'Feature', value: 'feature' },
    { title: 'Task', label: 'Task', value: 'task' },
  ];

  const capabilityOptions = [
    { title: 'Capability 1', label: 'Capability 1', value: 'capability1' },
    { title: 'Capability 2', label: 'Capability 2', value: 'capability2' },
    { title: 'Capability 3', label: 'Capability 3', value: 'capability3' },
  ];

  const productOwnerOptions = [
    { title: 'Owner 1', label: 'Owner 1', value: 'owner1' },
    { title: 'Owner 2', label: 'Owner 2', value: 'owner2' },
    { title: 'Owner 3', label: 'Owner 3', value: 'owner3' },
  ];

  // Common filter function for search
  const customizeFilter = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <Card
      hover
      ref={cardHeaderRef}
      className="lmn-shadow-lg lmn-p-3 lmn-mb-5 lmn-bg-white lmn-border lmn-border-strong lmn-col-12 lmn-mt-4px"
      style={{ maxWidth: '800px', margin: '0 auto' }}
      getPopupContainer={() => document.querySelector('#popover20')}
    >
      <h3 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Extended Filters</h3>

      {/* Row 1: Sprint and Domain */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Sprint Filter */}
        <div style={{ flex: '1' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#333',
            }}
          >
            Sprint
          </label>
          <Select
            showSearch
            highlightOption
            style={{ width: '100%' }}
            placeholder="Select an option"
            onChange={(value) => onChange('sprint', value)}
            optionLabelProp="label"
            customizeFilter={customizeFilter}
            getPopupContainer={() => document.querySelector('#app-content')}
            value={filters.sprint}
          >
            {sprintOptions.map((option) => (
              <Option
                key={option.value}
                title={option.title}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Domain Filter */}
        <div style={{ flex: '1' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#333',
            }}
          >
            Domain
          </label>
          <Select
            showSearch
            highlightOption
            style={{ width: '100%' }}
            placeholder="Select an option"
            onChange={(value) => onChange('domain', value)}
            optionLabelProp="label"
            customizeFilter={customizeFilter}
            getPopupContainer={() => document.querySelector('#app-content')}
            value={filters.domain}
          >
            {domainOptions.map((option) => (
              <Option
                key={option.value}
                title={option.title}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Row 2: TPM and Issue Type */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* TPM Filter */}
        <div style={{ flex: '1' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#333',
            }}
          >
            TPM
          </label>
          <Select
            showSearch
            highlightOption
            style={{ width: '100%' }}
            placeholder="Select an option"
            onChange={(value) => onChange('tpm', value)}
            optionLabelProp="label"
            customizeFilter={customizeFilter}
            getPopupContainer={() => document.querySelector('#app-content')}
            value={filters.tpm}
          >
            {tpmOptions.map((option) => (
              <Option
                key={option.value}
                title={option.title}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Issue Type Filter */}
        <div style={{ flex: '1' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#333',
            }}
          >
            Issue Type
          </label>
          <Select
            showSearch
            highlightOption
            style={{ width: '100%' }}
            placeholder="Select an option"
            onChange={(value) => onChange('issueType', value)}
            optionLabelProp="label"
            customizeFilter={customizeFilter}
            getPopupContainer={() => document.querySelector('#app-content')}
            value={filters.issueType}
          >
            {issueTypeOptions.map((option) => (
              <Option
                key={option.value}
                title={option.title}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Row 3: Capability and Product Owner */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Capability Filter */}
        <div style={{ flex: '1' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#333',
            }}
          >
            Capability
          </label>
          <Select
            showSearch
            highlightOption
            style={{ width: '100%' }}
            placeholder="Select an option"
            onChange={(value) => onChange('capability', value)}
            optionLabelProp="label"
            customizeFilter={customizeFilter}
            getPopupContainer={() => document.querySelector('#app-content')}
            value={filters.capability}
          >
            {capabilityOptions.map((option) => (
              <Option
                key={option.value}
                title={option.title}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Product Owner Filter */}
        <div style={{ flex: '1' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              color: '#333',
            }}
          >
            Product Owner
          </label>
          <Select
            showSearch
            highlightOption
            style={{ width: '100%' }}
            placeholder="Select an option"
            onChange={(value) => onChange('productOwner', value)}
            optionLabelProp="label"
            customizeFilter={customizeFilter}
            getPopupContainer={() => document.querySelector('#app-content')}
            value={filters.productOwner}
          >
            {productOwnerOptions.map((option) => (
              <Option
                key={option.value}
                title={option.title}
                label={option.label}
                value={option.value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <Button onClick={handleCancel} className="lmn-mr-8px" color="outline">
          Clear
        </Button>
        <Button onClick={handleApply} className="lmn-mr-8px" color="primary">
          Apply
        </Button>
      </div>
    </Card>
  );
}