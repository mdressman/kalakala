		</div>
		
			
		<?php 
		$mobile = 'false';
		if(is_mobile()): 
			$mobile = 'true';
		endif;
		?>
		<script type="text/javascript">
			var isMobile = <?php echo $mobile; ?>;
		</script> 

		<?php wp_footer(); ?>
	</body>
</html>
