



(worksish)

theQ = <TextField
				id={this.props.id}
				select
				label={this.props.label}
				className={classes.textField}
				value={this.state.value}
				onChange={this.handleChange(this.props.id)}
				SelectProps={{
					native: true,
					MenuProps: {
						className: classes.menu,
					},
				}}
				margin="normal"
			>
				{this.props.selectOptions.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
				</TextField>







